import _size from 'lodash/size'
import types from '../../constants/ws'

function getInitialState() {
  return {
    executing: false,
    options: {},
  }
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action
  switch (type) {
    case types.EXECUTION_START: {
      return {
        ...state,
        executing: true,
      }
    }

    case types.EXECUTION_STOP: {
      return {
        ...state,
        executing: false,
      }
    }

    case types.SET_EXECUTION_OPTIONS: {
      const { options = {} } = payload
      if (!_size(options)) {
        return {
          ...state,
        }
      }
      return {
        ...state,
        options,
      }
    }

    case types.RESET_DATA_EXECUTION: {
      return getInitialState()
    }

    default: {
      return state
    }
  }
}

export default reducer
