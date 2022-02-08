import _size from 'lodash/size'
import types from '../../constants/ws'

function getInitialState() {
  return {
    executing: false,
    loading: false,
    options: {},
    results: {},
  }
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action
  switch (type) {
    case types.EXECUTION_START: {
      return {
        ...state,
        results: {},
        executing: true,
      }
    }

    case types.EXECUTION_STOP: {
      return {
        ...state,
        executing: false,
      }
    }

    case types.EXECUTION_LOADING: {
      const { loading } = payload

      return {
        ...state,
        loading,
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

    case types.SET_EXECUTION_RESULTS: {
      const { results = {} } = payload

      return {
        ...state,
        results,
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
