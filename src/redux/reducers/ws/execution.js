import types from '../../constants/ws'

function getInitialState() {
  return {
    executing: [
      // ['strategy-id', 'strategy-id', ...]
    ],
    loading: false,
    loadingGid: null,
    results: {
      // 'strategy-map-key': { /* results */ }
    },
    activeStrategies: {
      // 'strategy-map-key': { /* ...strategy, startedOn */ }
    },
    runningStrategiesMapping: {
      // 'strategy-id': 'strategy-map-key'
    },
    pastStrategies: [],
  }
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action
  switch (type) {
    case types.SET_EXECUTING_STRATEGIES: {
      const { executing } = payload

      return {
        ...state,
        executing,
      }
    }

    case types.EXECUTION_LOADING: {
      const { loading, loadingGid } = payload

      if (loadingGid) {
        return {
          ...state,
          loading,
          loadingGid,
        }
      }

      return {
        ...state,
        loading,
      }
    }

    case types.EXECUTION_LOADING_GID: {
      const { loadingGid } = payload

      return {
        ...state,
        loadingGid,
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
        results: {
          ...state.results,
          [strategyMapKey]: executionResultsObj,
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
