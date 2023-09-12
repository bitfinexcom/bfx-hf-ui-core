import { call, put, delay } from 'redux-saga/effects'
import Debug from 'debug'
import { isFuture } from 'date-fns'
import { Recurring } from 'bfx-hf-algo'
import runRecurringAOScheduler from './run_recurring_ao_scheduler'
import AOActions from '../../actions/ao'
import { RECURRING_DELAY_FOR_FETCH } from '../../helpers/recurring_ao'

const debug = Debug('hfui:recurring-ao')

export default function* processRecurringAO({ payload }) {
  const {
    ao: {
      gid, args, createdAt, lastActive, id,
    },
    mode,
  } = payload
  if (id !== Recurring.id) {
    return
  }

  const { startedAt, recurrence, endedAt = null } = args
  const isOrderNew = createdAt === lastActive
  const shouldAtomicsBeFetched = !isFuture(new Date(startedAt)) && isOrderNew

  if (!shouldAtomicsBeFetched) {
    yield call(runRecurringAOScheduler, {
      gid, startedAt, endedAt, recurrence, mode,
    })
    return
  }
  debug('fetch recurring ao %s atomics in 1.5m', gid)
  yield delay(RECURRING_DELAY_FOR_FETCH)
  yield put(AOActions.requestRecurringAOAtomics({ gid, firstDataRequest: false }))
}
