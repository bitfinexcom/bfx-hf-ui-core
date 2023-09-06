import types from '../../constants/ws'

const getInitialState = () => {
  return {}
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = {} } = action

  switch (type) {
    case types.RESET_ORDER_HIST: {
      return getInitialState()
    }

    case types.SET_ORDER_HIST: {
      const { orderHist } = payload

      return {
        ...state,
        ...orderHist,
      }
    }

    case types.DATA_ORDER_CLOSE: {
      const { order = {} } = payload

      return {
        ...state,
        [order?.id]: order,
      }
    }

    default: {
      return state
    }
  }
}
