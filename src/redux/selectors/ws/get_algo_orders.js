import _get from 'lodash/get'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAlgoOrders = (state) => {
  return _get(state, `${path}.algoOrders`, EMPTY_OBJ)
}

export default getAlgoOrders
