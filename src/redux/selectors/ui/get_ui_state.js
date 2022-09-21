import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

export default (state, key, defaultValue = '') => _get(state, `${path}.${key}`, defaultValue)
