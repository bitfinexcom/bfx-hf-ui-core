import _reduce from 'lodash/reduce'
import types from '../../constants/ws'

function getInitialState() {
  return {
    loading: false,
    isConnected: true,
    connectionLostDurationMs: 0,
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
      const stoppedStrategy = activeStrategies[strategyMapKey]
      stoppedStrategy.stoppedOn = Date.now()

      const pastStrategies = [...state.pastStrategies, stoppedStrategy]

      delete activeStrategies[strategyMapKey]

      return {
        ...state,
        activeStrategies,
        pastStrategies,
        loading: false,
      }
    }

    case types.SET_LIVE_EXECUTION_TRADES: {
      const { positionData, strategyMapKey, isOpened } = payload
      const { id } = positionData

      const results = state.results[strategyMapKey]
      const positions = results?.strategy
      const targetPositions = positions[isOpened ? 'openPositions' : 'closedPositions']

      const currentPosition = { ...targetPositions?.[id] || {}, ...positionData }

      const newState = {
        ...state.results,
        [strategyMapKey]: {
          ...results,
          strategy: {
            ...positions,
            [isOpened ? 'openPositions' : 'closedPositions']: {
              ...targetPositions,
              [id]: currentPosition,
            },
          },
        },
      }

      return {
        ...state,
        results: newState,
      }
    }

    case types.SET_EXECUTION_RESULTS: {
      const { strategyId, results = {} } = payload

      return {
        ...state,
        results: {
          ...state.results,
          [strategyId]: results,
        },
      }
    }

    case types.DISCONNECTED:
    case types.RESET_DATA_EXECUTION: {
      return {
        ...state,
        loading: false,
        loadingGid: null,
        activeStrategies: {},
      }
    }

    case types.EXECUTION_CONNECTION_LOST: {
      const { isConnectionLost } = payload

      const newState = {
        ...state,
        isConnected: !isConnectionLost,
      }

      if (isConnectionLost) {
        newState.lostConnectionAt = Date.now()
      } else if (state.lostConnectionAt) {
        const diff = Date.now() - state.lostConnectionAt
        newState.connectionLostDurationMs = state.connectionLostDurationMs + diff
        delete newState.lostConnectionAt
      }
      return newState
    }

    default: {
      return state
    }
  }
}

export default reducer
