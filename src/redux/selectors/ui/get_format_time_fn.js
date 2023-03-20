import { createSelector } from 'reselect'
import { formatTime } from '../../../util/date'
import { getTimestampFormat } from './get_settings'

const getFormatTimeFn = createSelector(getTimestampFormat, (timestampFormat) => formatTime(timestampFormat))

export default getFormatTimeFn
