import _size from 'lodash/size'
import types from '../../constants/ws'

function getInitialState() {
  return {
    executing: false,
    loading: false,
    options: {},
    results: {
      // 'unique-strategy-id': { /* results */ }
    },
    activeStrategies: {
      // 'unique-strategy-id': { /* ...strategy, startedOn */ }
    },
    runningStrategiesMapping: {
      // 'strategy-id': 'unique-strategy-id'
    },
    pastStrategies: [],
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

    case types.SET_PRICE_UPDATE: {
      const { strategyMapKey, executionResultsObj } = payload

      return {
        ...state,
        results: {
          ...state.results,
          [strategyMapKey]: executionResultsObj,
        },
      }
    }

    case types.SET_PAST_STRATEGIES: {
      const { pastStrategies } = payload

      return {
        ...state,
        pastStrategies,
      }
    }

    case types.SET_STARTED_LIVE_STRATEGY: {
      const { strategyMapKey, executionResultsObj } = payload
      const { id } = executionResultsObj

      return {
        ...state,
        activeStrategies: {
          ...state.activeStrategies,
          [strategyMapKey]: executionResultsObj,
        },
        runningStrategiesMapping: {
          [id]: strategyMapKey,
        },
      }
    }

    case types.SET_STOPPED_LIVE_STRATEGY: {
      const { strategyMapKey, executionResultsObj } = payload
      const { id } = executionResultsObj

      return {
        ...state,
        activeStrategies: {
          ...state.activeStrategies,
          [strategyMapKey]: undefined,
        },
        runningStrategiesMapping: {
          [id]: undefined,
        },
        loading: false,
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

    case types.SET_LIVE_EXECUTION_TRADES: {
      const { strategyMapKey, trades } = payload

      return {
        ...state,
        results: {
          ...state.results,
          [strategyMapKey]: {
            ...(state.results[strategyMapKey] || {}),
            strategy: {
              trades,
            },
          },
        },
      }
    }

    case types.SET_EXECUTION_RESULTS: {
      const { strategyId, results = {} } = payload

      return {
        ...state,
        results: {
          [strategyId]: results,
        },
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
