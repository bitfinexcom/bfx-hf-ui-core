import {
  call, delay, put, race, take,
} from 'redux-saga/effects'
import _max from 'lodash/max'
import Debug from 'debug'
import {
  RECURRING_DELAY_FOR_FETCH,
  calculateNextExecutionTime,
} from '../../helpers/recurring_ao'
import AOActions from '../../actions/ao'
import WSActions from '../../actions/ws'
import WSTypes from '../../constants/ws'

const debug = Debug('hfui:recurring-ao')

function* purgeSchedulerOnAlgoOrderChange({ gid, sagaToExecute }) {
  console.log('before race')
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

function* scheduleCancellation({ gid, endedAtTime, endedAt }) {
  const delayTime = _max(endedAtTime - Date.now(), 0)
  debug('scheduled cancelation of %s', gid, {
    endedAt,
    delayTime,
  })
  yield delay(delayTime)
  yield put(WSActions.cancelAlgoOrder(gid))
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
    AOActions.requestRecurringAoAtomics({ gid, firstDataRequest: false }),
  )
}

export default function* scheduleRecurringAo({
  gid,
  startedAt,
  endedAt,
  recurrence,
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
      sagaToExecute: scheduleCancellation({ gid, endedAtTime, endedAt }),
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
