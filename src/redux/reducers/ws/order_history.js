import types from '../../constants/ws'

const getInitialState = () => {
  return []
}

export default (state = getInitialState(), action = {}) => {
  const { type, payload = [] } = action

  switch (type) {
    case types.DATA_ORDER_CLOSE: {
      const { order = {} } = payload
      return [
        order,
        ...state,
      ]
    }

    default: {
      return state
    }
  }
}
