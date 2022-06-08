import { getDefaultMarket } from '../../util/market'

const ONE_MIN = 1000 * 60
const ONE_HOUR = ONE_MIN * 60
const ONE_DAY = ONE_HOUR * 24

const DEFAULT_TIMEFRAME = '5m'
const DEFAULT_USE_TRADES = false
const DEFAULT_USE_MARGIN = false
const DEFAULT_SEED_COUNT = 150
const DEFAULT_CANDLES = true

const LS_HF_UI_EXECUTE_STRATEGY = 'HF_UI_EXECUTE_STRATEGY'

export const STRATEGY_OPTIONS_KEYS = {
  SYMBOL: 'symbol',
  TIMEFRAME: 'timeframe',
  TRADES: 'trades',
  CANDLES: 'candles',
  CANDLE_SEED: 'candleSeed',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  MARGIN: 'margin',
  CAPITAL_ALLOCATION: 'capitalAllocation',
  STOP_LESS_PERC: 'stopLossPerc',
  MAX_DRAWDOWN_PERC: 'maxDrawdownPerc',
  STRATEGY_TYPE: 'strategyType',
}

export const getDefaultStrategyOptions = (markets) => {
  return {
    [STRATEGY_OPTIONS_KEYS.SYMBOL]: getDefaultMarket(markets),
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: DEFAULT_TIMEFRAME,
    [STRATEGY_OPTIONS_KEYS.TRADES]: DEFAULT_USE_TRADES,
    [STRATEGY_OPTIONS_KEYS.CANDLES]: DEFAULT_CANDLES,
    [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: DEFAULT_SEED_COUNT,
    [STRATEGY_OPTIONS_KEYS.START_DATE]: new Date(Date.now() - ONE_DAY),
    [STRATEGY_OPTIONS_KEYS.END_DATE]: new Date(Date.now() - ONE_MIN * 15),
    [STRATEGY_OPTIONS_KEYS.MARGIN]: DEFAULT_USE_MARGIN,
    [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: '',
    [STRATEGY_OPTIONS_KEYS.STOP_LESS_PERC]: '',
    [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: '',
    [STRATEGY_OPTIONS_KEYS.STRATEGY_TYPE]: null,
  }
}

export const prepareStrategyExecutionArgs = (strategy) => {
  const {
    strategyOptions: {
      symbol,
      timeframe,
      trades,
      candleSeed,
      margin,
      capitalAllocation,
      stopLossPerc,
      maxDrawdownPerc,
    },
    label,
  } = strategy

  return {
    label,
    symbol: symbol?.wsID,
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: timeframe,
    [STRATEGY_OPTIONS_KEYS.TRADES]: trades,
    strategy,
    [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: candleSeed,
    [STRATEGY_OPTIONS_KEYS.MARGIN]: margin,
    constraints: {
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: Number(capitalAllocation),
      [STRATEGY_OPTIONS_KEYS.STOP_LESS_PERC]: Number(stopLossPerc),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: Number(maxDrawdownPerc),
    },
  }
}

export const prepareStrategyBacktestingArgs = (strategy) => {
  const {
    strategyOptions: {
      symbol,
      timeframe,
      trades,
      candles,
      capitalAllocation,
      stopLossPerc,
      maxDrawdownPerc,
      startDate,
      endDate,
    },
  } = strategy

  return {
    symbol: symbol?.wsID,
    startNum: new Date(startDate).getTime(),
    endNum: new Date(endDate).getTime(),
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: timeframe,
    [STRATEGY_OPTIONS_KEYS.TRADES]: trades,
    strategy,
    [STRATEGY_OPTIONS_KEYS.CANDLES]: candles,
    constraints: {
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: Number(capitalAllocation),
      [STRATEGY_OPTIONS_KEYS.STOP_LESS_PERC]: Number(stopLossPerc),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: Number(maxDrawdownPerc),
    },
  }
}

export const saveStrategyToExecuteToLS = (strategyToExecute) => {
  localStorage.setItem(LS_HF_UI_EXECUTE_STRATEGY, strategyToExecute.id)
}

export const parseStrategyToExecuteFromLS = () => {
  const strategyId = localStorage.getItem(LS_HF_UI_EXECUTE_STRATEGY)
  if (strategyId) {
    localStorage.removeItem(LS_HF_UI_EXECUTE_STRATEGY)
  }
  return strategyId
}

export const removeStrategyToExecuteFromLS = () => {
  localStorage.removeItem(LS_HF_UI_EXECUTE_STRATEGY)
}
