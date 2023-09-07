import { RECURRENCE_OPTIONS } from '../../components/OrderForm/OrderForm.helpers'
import TIMEFRAME_WIDTH from '../../util/time_frame_widths'

const RECURRENCE_WIDTH = {
  [RECURRENCE_OPTIONS.DAILY]: TIMEFRAME_WIDTH['1D'],
  [RECURRENCE_OPTIONS.WEEKLY]: TIMEFRAME_WIDTH['1w'],
  [RECURRENCE_OPTIONS.MONTHLY]: TIMEFRAME_WIDTH['1M'],
}

export const calculateNextExecutionTime = (startedAt, endedAt, recurrence) => {
  const recurrenceMs = RECURRENCE_WIDTH[recurrence]

  if (!recurrenceMs) {
    throw new Error('Wrong recurrence')
  }

  let nextExecutionTime = new Date(startedAt).getTime()
  const endedAtTime = endedAt ? new Date(endedAt).getTime() : Infinity

  while (nextExecutionTime <= endedAtTime) {
    if (nextExecutionTime >= Date.now()) {
      break
    }
    nextExecutionTime += recurrenceMs
  }

  return nextExecutionTime
}
