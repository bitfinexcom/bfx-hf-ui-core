import { delay } from 'redux-saga/effects'
import Debug from 'debug'
import { DELAY_FOR_FETCH, calculateNextExecutionTime } from '../../helpers/recurring_ao'
import fetchRecurringAoAtomics from './fetch_recurring_ao_atomics'

const debug = Debug('hfui:recurring-ao')

export default function* scheduleFetchingRecurringAOStatus({
  gid, startedAt, endedAt, recurrence,
}) {
  const nextExecutionTime = calculateNextExecutionTime(startedAt, endedAt, recurrence)
  const delayTime = nextExecutionTime - Date.now() + DELAY_FOR_FETCH

  debug('scheduled fetching for %s', gid, {
    startedAt,
    endedAt,
    recurrence,
    nextExecutionTime: new Date(nextExecutionTime).toISOString(),
    fetchInMs: delayTime,
  })
  yield delay(delayTime)
  yield fetchRecurringAoAtomics({ gid, firstDataRequest: false })
}
