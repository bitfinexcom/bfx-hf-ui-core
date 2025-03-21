import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

export const getFeatureFlags = (state) => _get(state, `${path}.featureFlags`)

export default getFeatureFlags
