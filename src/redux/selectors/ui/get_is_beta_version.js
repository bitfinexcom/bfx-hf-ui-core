import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const getIsBetaVersion = (state) => _get(state, `${path}.isBetaVersion`)

export default getIsBetaVersion
