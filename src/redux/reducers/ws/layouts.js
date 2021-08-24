import types from '../../constants/ws'

function getInitialState() {
  return {
    layouts: null,
    isLoaded: false,
  }
}

export default function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action

  switch (type) {
    case types.DATA_LAYOUTS: {
      return {
        ...state,
        layouts: payload,
        isLoaded: true,
      }
    }

    case types.UPDATE_LAYOUTS: {
      return {
        ...state,
        layouts: payload,
      }
    }

    default:
      return state
  }
}
