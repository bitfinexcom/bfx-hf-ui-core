import types from '../../constants/ws'

const getInitialState = () => {
  return {
    placed: {},
    failed: {},
  }
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = [] } = action

  switch (type) {
    case types.RESET_ORDER_HIST: {
      return getInitialState()
    }

    case types.SET_ORDER_HIST: {
      const { orderHist: { placed, failed } } = payload

      return {
        placed: {
          ...state.placed,
          ...placed,
        },
        failed: {
          ...state.failed,
          ...failed,
        },
      }
    }

    case types.DATA_ORDER_CLOSE: {
      const { order = {} } = payload

      return {
        ...state,
        placed: {
          ...state.placed,
          [order?.id]: order,
        },
      }
    }

    default: {
      return state
    }
  }
}
