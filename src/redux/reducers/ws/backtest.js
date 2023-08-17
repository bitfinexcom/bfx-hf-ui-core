import WSTypes from '../../constants/ws'
import UITypes from '../../constants/ui'

function getInitialState() {
  return {
    result: null,
    currentTest: null,
    loading: false,
    executing: false,
    finished: false,
    trades: [],
    candles: [],
    gid: null,
    progressPerc: 0,
  }
}

function reducer(state = getInitialState(), action = {}) {
  const { type, payload = {} } = action
  switch (type) {
    case WSTypes.BACKTEST_EXECUTE: {
      // data server has received backtest request
      // and is syncing data
      const newState = getInitialState()
      return {
        ...newState,
        loading: true,
        currentTest: payload,
      }
    }

    case WSTypes.BACKTEST_START: {
      // data server is about to start sending
      // backtest data
      return {
        ...state,
        loading: false,
        executing: true,
      }
    }

    case WSTypes.SET_BACKTEST_LOADING: {
      return {
        ...state,
        loading: true,
      }
    }

    case WSTypes.BACKTEST_PROGRESS: {
      const { progressPerc } = payload
      return {
        ...state,
        progressPerc,
      }
    }

    case WSTypes.BACKTEST_RESULTS: {
      const { results, isExecuted } = payload
      return {
        ...state,
        finished: isExecuted,
        results,
      }
    }

    case WSTypes.BACKTEST_STARTED: {
      const { gid } = payload

      return {
        ...state,
        gid,
      }
    }

    case WSTypes.BACKTEST_STOPPED: {
      return {
        ...state,
        loading: false,
        executing: false,
        gid: null,
      }
    }

    case WSTypes.DISCONNECTED:
    case WSTypes.PURGE_DATA_BACKTEST:
    case UITypes.SET_CURRENT_STRATEGY: {
      return getInitialState()
    }

    case WSTypes.BACKTEST_CANDLE: {
      state.candles.push(payload)
      return state
    }

    case WSTypes.BACKTEST_TRADE: {
      state.trades.push(payload)
      return state
    }

    default: {
      return state
    }
  }
}

export default reducer
