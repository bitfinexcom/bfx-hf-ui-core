import _map from 'lodash/map'
import { all, call, put } from 'redux-saga/effects'
import { isFuture } from 'date-fns'
import _isEmpty from 'lodash/isEmpty'
import runRecurringAOScheduler from './run_recurring_ao_scheduler'
import AOActions from '../../actions/ao'

export default function* processRecurringAOs({ payload }) {
  const { aos, mode } = payload

  if (_isEmpty(aos)) {
    return
  }
  const operations = _map(aos, ({ gid, args }) => {
    const { startedAt, recurrence, endedAt = null } = args

    const shouldAtomicsBeFetched = !isFuture(new Date(startedAt))

    if (!shouldAtomicsBeFetched) {
      return call(runRecurringAOScheduler, {
        gid, startedAt, endedAt, recurrence, mode,
      })
    }
    return put(AOActions.requestRecurringAOAtomics({ gid, firstDataRequest: true }))
  })

  yield all(operations)
}
