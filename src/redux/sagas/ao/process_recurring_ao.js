import { call } from 'redux-saga/effects'
import { isFuture } from 'date-fns'
import scheduleFetchingRecurringAOStatus from './schedule_fetching_recurring_ao_status'
import fetchRecurringAoAtomics from './fetch_recurring_ao_atomics'

export default function* processRecurringAO({ payload }) {
  const { ao: { gid, args } } = payload

  const { startedAt, recurrence, endedAt = null } = args

  const shouldAtomicsBeFetched = !isFuture(new Date(startedAt))

  if (!shouldAtomicsBeFetched) {
    yield call(scheduleFetchingRecurringAOStatus, {
      gid, startedAt, endedAt, recurrence,
    })
  }
  yield call(fetchRecurringAoAtomics, { gid, firstDataRequest: false })
}
