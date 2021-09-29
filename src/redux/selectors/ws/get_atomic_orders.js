import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_ARR = []

const getAtomicOrders = (state) => {
  return _get(state, `${path}.orders`, EMPTY_ARR)
}

export default getAtomicOrders
