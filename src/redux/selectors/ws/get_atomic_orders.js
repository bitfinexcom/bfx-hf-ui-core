import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAtomicOrders = (state) => {
  return _get(state, `${path}.orders`, EMPTY_OBJ)
}

export default getAtomicOrders
