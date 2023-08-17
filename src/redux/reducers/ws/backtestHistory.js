import _get from 'lodash/get'
import _forEach from 'lodash/forEach'
import _omit from 'lodash/omit'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import WSTypes from '../../constants/ws'
import UITypes from '../../constants/ui'

const getInitialState = () => ({
  mappedKeysByStrategyIds: {},
  backtests: {},
  backtestId: null,
})

const reducer = (state = getInitialState(), action = {}) => {
  const { type, payload = {} } = action

  switch (type) {
    case WSTypes.ADD_STRATEGY_BACKTESTS_LIST: {
      const { strategyId, backtestsList } = payload

      const mappedBacktestKeys = []
      const backtests = {
        ...state.backtests,
      }

      _forEach(backtestsList, (_backtest) => {
        const { executionId, isFavorite } = _backtest
        mappedBacktestKeys.push(executionId)
        const backtest = { ..._backtest }

        // normalize types after SQLite
        backtest.isFavorite = !!isFavorite

        backtests[executionId] = backtest
      })

      return {
        ...state,
        mappedKeysByStrategyIds: {
          ...state.mappedKeysByStrategyIds,
          [strategyId]: mappedBacktestKeys,
        },
        backtests,
      }
    }

    case WSTypes.BACKTEST_SET_FAVORITE: {
      const { backtestId, isFavorite } = payload

      const backtest = _get(state, `backtests.${backtestId}`, {})

      return {
        ...state,
        backtests: {
          ...state.backtests,
          [backtestId]: {
            ...backtest,
            isFavorite: !!isFavorite,
          },
        },
      }
    }

    case WSTypes.BACKTEST_REMOVE: {
      const { backtestId } = payload

      const backtest = _get(state, `backtests.${backtestId}`, {})
      const { strategyId } = backtest
      const backtestKeys = state.mappedKeysByStrategyIds[strategyId]
      const filteredKeys = _filter(backtestKeys, (id) => backtestId !== id)

      return {
        ...state,
        mappedKeysByStrategyIds: {
          ...state.mappedKeysByStrategyIds,
          [strategyId]: filteredKeys,
        },
        backtests: _omit(state.backtests, backtestId),
      }
    }

    case WSTypes.SET_BACKTEST_TO_HISTORY: {
      const { backtest } = payload
      const { executionId, strategyId } = backtest

      const strategyMappedKeys = state.mappedKeysByStrategyIds[strategyId] || []

      return {
        ...state,
        backtests: {
          ...state.backtests,
          [executionId]: backtest,
        },
        mappedKeysByStrategyIds: {
          ...state.mappedKeysByStrategyIds,
          [strategyId]: [...strategyMappedKeys, executionId],
        },
      }
    }

    case WSTypes.DATA_REMOVE_STRATEGY: {
      const { id: strategyId } = payload
      const { backtests, mappedKeysByStrategyIds } = state
      const backtestIds = mappedKeysByStrategyIds[strategyId] || []

      if (_isEmpty(backtestIds)) {
        return { ...state }
      }

      return {
        ...state,
        backtests: _omit(backtests, backtestIds),
        mappedKeysByStrategyIds: _omit(mappedKeysByStrategyIds, strategyId),
      }
    }

    case WSTypes.SET_HISTORY_BACKTEST_ID: {
      const { id } = payload

      return {
        ...state,
        backtestId: id,
      }
    }

    case UITypes.SET_CURRENT_STRATEGY: {
      return {
        ...state,
        backtestId: null,
      }
    }

    default: {
      return state
    }
  }
}

export default reducer
