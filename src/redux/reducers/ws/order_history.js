import types from '../../constants/ws'

const getInitialState = () => {
  return []
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = [] } = action

  switch (type) {
    case types.SET_ORDER_HIST: {
      const { orderHist } = payload

      return {
        ...orderHist,
        ...state,
      }
    }

    case types.DATA_ORDER_CLOSE: {
      const { order = {} } = payload

      return {
        [order?.id]: order,
        ...state,
      }
    }

    default: {
      return state
    }
  }
}
