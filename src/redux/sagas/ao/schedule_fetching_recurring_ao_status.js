import { delay } from 'redux-saga/effects'
import timeframeWidths from '../../../util/time_frame_widths'
import { calculateNextExecutionTime } from '../../helpers/recurring_ao'
import fetchRecurringAoAtomics from './fetch_recurring_ao_atomics'

const DELAY_FOR_FETCH = timeframeWidths['1m'] * 2

export default function* scheduleFetchingRecurringAOStatus({
  gid, startedAt, endedAt, recurrence,
}) {
  const nextExecutionTime = calculateNextExecutionTime(startedAt, endedAt, recurrence)
  const delayTime = nextExecutionTime - Date.now() + DELAY_FOR_FETCH

  yield delay(delayTime)
  yield fetchRecurringAoAtomics({ gid, firstDataRequest: false })
}
