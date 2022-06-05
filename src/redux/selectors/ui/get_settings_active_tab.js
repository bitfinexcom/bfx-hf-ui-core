import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

export default (state) => _get(state, `${path}.settingsActiveTab`, null)

export const getSettingActiveSection = (state) => _get(state, `${path}.settingsActiveSection`, null)
