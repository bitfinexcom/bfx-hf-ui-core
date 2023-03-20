import { createSelector } from 'reselect'
import { safelyFormatTime } from '../../../util/date'
import { getTimestampFormat } from './get_settings'

const getFormatTimeFn = createSelector(getTimestampFormat, (timestampFormat) => safelyFormatTime(timestampFormat))

export default getFormatTimeFn
