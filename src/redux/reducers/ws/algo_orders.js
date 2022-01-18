import _omit from 'lodash/omit'
import _forEach from 'lodash/forEach'

import types from '../../constants/ws'

const getInitialState = () => {
  return {}
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = [] } = action

  switch (type) {
    case types.DATA_ALGO_ORDERS: {
      const { aos } = payload
      const transformed = {}
      _forEach(aos, ao => {
        transformed[ao?.gid] = ao
      })

      return transformed
    }

    case types.DATA_ALGO_ORDER: {
      const { ao } = payload

      return {
        ...state,
        [ao?.gid]: ao,
      }
    }

    case types.DATA_ALGO_ORDER_STOPPED: {
      const { gid } = payload

      return _omit(state, gid)
    }

    case types.CLEAR_ALGO_ORDERS:
    case types.DEAUTH: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}
