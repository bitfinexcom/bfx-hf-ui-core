import _map from 'lodash/map'
import { all, call, put } from 'redux-saga/effects'
import { isFuture } from 'date-fns'
import _isEmpty from 'lodash/isEmpty'
import scheduleRecurringAo from './schedule_recurring_ao'
import AOActions from '../../actions/ao'

export default function* processRecurringAOs({ payload }) {
  const { aos } = payload

  if (_isEmpty(aos)) {
    return
  }
  const operations = _map(aos, ({ gid, args }) => {
    const { startedAt, recurrence, endedAt = null } = args

    const shouldAtomicsBeFetched = !isFuture(new Date(startedAt))

    if (!shouldAtomicsBeFetched) {
      return call(scheduleRecurringAo, {
        gid, startedAt, endedAt, recurrence,
      })
    }
    return put(AOActions.requestRecurringAoAtomics({ gid, firstDataRequest: true }))
  })

  yield all(operations)
}
