import _omit from 'lodash/omit'
import _forEach from 'lodash/forEach'

import types from '../../constants/ws'
import { orderAdapter } from '../../adapters/ws'

const getInitialState = () => {
  return {}
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = [] } = action

  switch (type) {
    case types.DATA_ORDERS: {
      const { orders = [] } = payload
      const transformed = {}
      _forEach(orders, order => {
        const adapted = orderAdapter(order)
        transformed[adapted?.id] = adapted
      })

      return transformed
    }

    case types.DATA_ORDER: {
      const { order = [] } = payload
      const adapted = orderAdapter(order)

      return {
        ...state,
        [adapted?.id]: adapted,
      }
    }

    case types.DATA_ORDER_CLOSE: {
      const { order = {} } = payload

      return _omit(state, order?.id)
    }

    case types.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}
