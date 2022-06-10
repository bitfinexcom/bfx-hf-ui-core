import _reduce from 'lodash/reduce'
import types from '../../constants/ws'

function getInitialState() {
  return {
    loading: false,
    loadingGid: null,
    results: {
      // 'strategy-map-key': { /* results */ }
    },
    activeStrategies: {
      // 'strategy-map-key': { /* ...strategy, startedOn */ }
    },
    pastStrategies: [],
  }
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action
  switch (type) {
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
      const results = _reduce(
        pastStrategies,
        (acc, strategy) => {
          const { results: execResults, id } = strategy
          acc[id] = execResults
          return acc
        },
        {},
      )

      return {
        ...state,
        pastStrategies,
        results: {
          ...state.results,
          ...results,
        },
      }
    }

    case types.SET_STARTED_LIVE_STRATEGY: {
      const { strategyMapKey, executionResultsObj } = payload

      const loadingGid = state.loadingGid === strategyMapKey ? null : state.loadingGid

      return {
        ...state,
        activeStrategies: {
          ...state.activeStrategies,
          [strategyMapKey]: executionResultsObj,
        },
        loading: false,
        loadingGid,
      }
    }

    case types.SET_STOPPED_LIVE_STRATEGY: {
      const { strategyMapKey } = payload

      const activeStrategies = { ...state.activeStrategies }
      const pastStrategies = [
        ...state.pastStrategies,
        activeStrategies[strategyMapKey],
      ]

      delete activeStrategies[strategyMapKey]

      return {
        ...state,
        activeStrategies,
        pastStrategies,
        loading: false,
      }
    }

    case types.SET_LIVE_EXECUTION_TRADES: {
      const { strategyMapKey, positionData } = payload
      const { id } = positionData
      const currentState = state.results?.[strategyMapKey] || {}

      return {
        ...state,
        results: {
          ...state.results,
          [strategyMapKey]: {
            ...currentState,
            [id]: {
              ...(currentState?.[id] || {}),
              ...positionData,
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
