import _get from 'lodash/get'
import _forEach from 'lodash/forEach'
import _omit from 'lodash/omit'
import _filter from 'lodash/filter'
import types from '../../constants/ws'

const getInitialState = () => ({
  mappedKeysByStrategyIds: {},
  backtests: {},
})

const reducer = (state = getInitialState(), action = {}) => {
  const { type, payload = {} } = action

  switch (type) {
    case types.ADD_STRATEGY_BACKTESTS_LIST: {
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

    case types.BACKTEST_SET_FAVORITE: {
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

    case types.BACKTEST_REMOVE: {
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

    default: {
      return state
    }
  }
}

export default reducer
