import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getSavedStrategies = (state) => _get(state, `${path}.strategies`, EMPTY_OBJ)

export default getSavedStrategies
