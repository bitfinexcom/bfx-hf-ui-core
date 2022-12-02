import _get from 'lodash/get'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAlgoOrdersHistory = (state) => _get(state, `${path}.algoOrdersHistory`, EMPTY_OBJ)

export default getAlgoOrdersHistory
