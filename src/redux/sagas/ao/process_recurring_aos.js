import _map from 'lodash/map'
import { all, call, select } from 'redux-saga/effects'
import { isFuture } from 'date-fns'
import _isEmpty from 'lodash/isEmpty'
import scheduleFetchingRecurringAOStatus from './schedule_fetching_recurring_ao_status'
import fetchRecurringAoAtomics from './fetch_recurring_ao_atomics'
import { getCurrentMode } from '../../selectors/ui'
import { saveLastReceivedRecurringAosTimestamp } from '../../helpers/recurring_ao'

export default function* processRecurringAOs({ payload }) {
  const { aos } = payload

  if (_isEmpty(aos)) {
    return
  }
  const operations = _map(aos, ({ gid, args }) => {
    const { startedAt, recurrence, endedAt = null } = args

    const shouldAtomicsBeFetched = !isFuture(new Date(startedAt))

    if (!shouldAtomicsBeFetched) {
      return call(scheduleFetchingRecurringAOStatus, {
        gid, startedAt, endedAt, recurrence,
      })
    }
    return call(fetchRecurringAoAtomics, { gid, firstDataRequest: true })
  })

  yield all(operations)
}
