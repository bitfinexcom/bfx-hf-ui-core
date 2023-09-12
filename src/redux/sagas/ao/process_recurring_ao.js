import { call, put, delay } from 'redux-saga/effects'
import Debug from 'debug'
import { isFuture } from 'date-fns'
import { Recurring } from 'bfx-hf-algo'
import scheduleRecurringAo from './schedule_recurring_ao'
import AOActions from '../../actions/ao'
import { RECURRING_DELAY_FOR_FETCH } from '../../helpers/recurring_ao'

const debug = Debug('hfui:recurring-ao')

export default function* processRecurringAO({ payload }) {
  const {
    ao: {
      gid, args, createdAt, lastActive, id,
    },
  } = payload
  if (id !== Recurring.id) {
    return
  }

  const { startedAt, recurrence, endedAt = null } = args
  const isOrderNew = createdAt === lastActive
  const shouldAtomicsBeFetched = !isFuture(new Date(startedAt)) && isOrderNew

  if (!shouldAtomicsBeFetched) {
    yield call(scheduleRecurringAo, {
      gid, startedAt, endedAt, recurrence,
    })
    return
  }
  debug('fetch recurring ao %s atomics in 1.5m', gid)
  yield delay(RECURRING_DELAY_FOR_FETCH)
  yield put(AOActions.requestRecurringAoAtomics({ gid, firstDataRequest: false }))
}
