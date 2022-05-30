import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_OBJ = {}

const getActiveStrategies = (state) => _get(state, `${path}.execution.activeStrategies`, EMPTY_OBJ)

export default getActiveStrategies
