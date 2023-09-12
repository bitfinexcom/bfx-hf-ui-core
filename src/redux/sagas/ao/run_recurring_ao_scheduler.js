import {
  call, delay, put, race, select, take,
} from 'redux-saga/effects'
import _max from 'lodash/max'
import Debug from 'debug'
import { v4 } from 'uuid'
import {
  RECURRING_DELAY_FOR_FETCH,
  calculateNextExecutionTime,
} from '../../helpers/recurring_ao'
import AOActions from '../../actions/ao'
import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import WSTypes from '../../constants/ws'
import i18n from '../../../locales/i18n'
import { getFormatTimeFn } from '../../selectors/ui'
import { getAlgoOrderById } from '../../selectors/ws'

const debug = Debug('hfui:recurring-ao')

function* purgeSchedulerOnAlgoOrderChange({ gid, sagaToExecute }) {
  const { cancel } = yield race({
    delay: sagaToExecute,
    cancel: take((action) => {
      const {
        type,
        payload,
      } = action
      let shouldBeCanceled = false
      if (type === WSTypes.DATA_ALGO_ORDER) {
        const { ao: { gid: _gid } } = payload
        shouldBeCanceled = gid === _gid
      }
      if (type === WSTypes.DATA_ALGO_ORDER_STOPPED) {
        const { gid: _gid } = payload
        shouldBeCanceled = gid === _gid
      }
      if (shouldBeCanceled) {
        debug('scheduler of %s was cancelled', gid)
      }
      return shouldBeCanceled
    }),
  })

  return cancel
}

function* scheduleCancellation({
  gid, endedAtTime, endedAt, mode,
}) {
  const delayTime = _max([endedAtTime - Date.now(), 0])
  debug('scheduled cancelation of %s', gid, {
    endedAt,
    delayTime,
  })
  const algoOrder = yield select(getAlgoOrderById(gid))
  const { alias } = algoOrder
  yield delay(delayTime)

  yield put(WSActions.setAlgoOrderToHistory(gid, mode))
  yield put(WSActions.removeAlgoOrder(gid, mode))

  const formatTime = yield select(getFormatTimeFn)
  yield put(UIActions.recvNotification({
    mts: Date.now(),
    status: 'info',
    text: i18n.t('notifications.recurringAOWasFinished', { alias, time: formatTime(endedAt) }),
    cid: v4(),
  }))
}

function* scheduleFetching({
  gid, nextExecutionTime, startedAt, endedAt, recurrence,
}) {
  const delayTime = nextExecutionTime - Date.now() + RECURRING_DELAY_FOR_FETCH

  debug('scheduled fetching for %s', gid, {
    startedAt,
    endedAt,
    recurrence,
    nextExecutionTime: new Date(nextExecutionTime).toISOString(),
    fetchInMs: delayTime,
  })

  yield delay(delayTime)
  yield put(
    AOActions.requestRecurringAOAtomics({ gid, firstDataRequest: false }),
  )
}

export default function* runRecurringAOScheduler({
  gid,
  startedAt,
  endedAt,
  recurrence,
  mode,
}) {
  const nextExecutionTime = calculateNextExecutionTime(
    startedAt,
    endedAt,
    recurrence,
  )
  const endedAtTime = endedAt ? new Date(endedAt).getTime() : null

  const shouldBeCancelled = endedAtTime && endedAtTime < nextExecutionTime
  if (shouldBeCancelled) {
    yield call(purgeSchedulerOnAlgoOrderChange, {
      gid,
      sagaToExecute: scheduleCancellation({
        gid, endedAtTime, endedAt, mode,
      }),
    })
    return
  }
  yield call(purgeSchedulerOnAlgoOrderChange, {
    gid,
    sagaToExecute: scheduleFetching({
      gid, nextExecutionTime, startedAt, endedAt, recurrence,
    }),
  })
}
