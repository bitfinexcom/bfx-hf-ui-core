import _find from 'lodash/find'
import _map from 'lodash/map'
import _reduce from 'lodash/reduce'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import { MAX_STRATEGY_LABEL_LENGTH as MAX_LABEL_LENGTH } from '../../constants/variables'

import { getTradeAmount, getTradePriceAvg } from '../StrategyTradesTable/TradesTable/TradesTable.helpers'

const ONE_MIN = 1000 * 60
const ONE_HOUR = ONE_MIN * 60
const ONE_DAY = ONE_HOUR * 24

const DEFAULT_TIMEFRAME = '1m'
const DEFAULT_USE_TRADES = false
const DEFAULT_USE_MARGIN = false
const DEFAULT_SEED_COUNT = 10
const DEFAULT_CANDLES = true

const LS_HF_UI_EXECUTE_STRATEGY = 'HF_UI_EXECUTE_STRATEGY'

export const STRATEGY_IDE_SECTIONS = [
  'defineIndicators',
  'defineMeta',
  'onPriceUpdate',
  'onEnter',
  'onUpdate',
  'onUpdateLong',
  'onUpdateShort',
  'onUpdateClosing',
  'onPositionOpen',
  'onPositionUpdate',
  'onPositionClose',
  'onStart',
  'onStop',
]

export const EXECUTION_TYPES = Object.freeze({
  LIVE: 'LIVE',
  BACKTEST: 'BACKTEST',
})

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
  STOP_LOSS_PERC: 'stopLossPerc',
  MAX_DRAWDOWN_PERC: 'maxDrawdownPerc',
  STRATEGY_TYPE: 'strategyType',
}

export const getDefaultStrategyOptions = () => {
  return {
    [STRATEGY_OPTIONS_KEYS.SYMBOL]: null,
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: DEFAULT_TIMEFRAME,
    [STRATEGY_OPTIONS_KEYS.TRADES]: DEFAULT_USE_TRADES,
    [STRATEGY_OPTIONS_KEYS.CANDLES]: DEFAULT_CANDLES,
    [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: DEFAULT_SEED_COUNT,
    [STRATEGY_OPTIONS_KEYS.START_DATE]: new Date(Date.now() - ONE_DAY),
    [STRATEGY_OPTIONS_KEYS.END_DATE]: new Date(Date.now() - ONE_MIN * 15),
    [STRATEGY_OPTIONS_KEYS.MARGIN]: DEFAULT_USE_MARGIN,
    [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: '',
    [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: '',
    [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: '',
    [STRATEGY_OPTIONS_KEYS.STRATEGY_TYPE]: null,
  }
}

export const prepareStrategyExecutionArgs = (strategy) => {
  const {
    strategyOptions: {
      symbol,
      candleSeed,
      capitalAllocation,
      stopLossPerc,
      maxDrawdownPerc,
      strategyType,
    },
    label,
    strategyContent,
    id,
  } = strategy

  return {
    label,
    symbol: symbol?.wsID,
    [STRATEGY_OPTIONS_KEYS.STRATEGY_TYPE]: strategyType,
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: DEFAULT_TIMEFRAME,
    [STRATEGY_OPTIONS_KEYS.TRADES]: DEFAULT_USE_TRADES,
    strategyContent,
    id,
    [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: candleSeed,
    [STRATEGY_OPTIONS_KEYS.MARGIN]: DEFAULT_USE_MARGIN,
    constraints: {
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: Number(capitalAllocation),
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: Number(stopLossPerc),
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
      candleSeed,
      capitalAllocation,
      stopLossPerc,
      maxDrawdownPerc,
      startDate,
      endDate,
    },
    strategyContent,
  } = strategy

  return {
    symbol: symbol?.wsID,
    startNum: new Date(startDate).getTime(),
    endNum: new Date(endDate).getTime(),
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: timeframe,
    [STRATEGY_OPTIONS_KEYS.TRADES]: trades,
    strategyContent,
    [STRATEGY_OPTIONS_KEYS.CANDLES]: candles,
    [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: candleSeed,
    constraints: {
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: Number(capitalAllocation),
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: Number(stopLossPerc),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: Number(maxDrawdownPerc),
    },
  }
}

export const prepareStrategyToLoad = (strategyToLoad, markets, strategies) => {
  const {
    strategyOptions: {
      symbol,
      capitalAllocation,
      stopLossPerc,
      maxDrawdownPerc,
    },
    strategyId,
    id,
  } = strategyToLoad
  const savedStrategyContent = _find(strategies, (st) => st.id === strategyId)

  return {
    ...savedStrategyContent,
    ...strategyToLoad,
    id: strategyId,
    executionId: id,
    strategyOptions: {
      ...getDefaultStrategyOptions(),
      ...strategyToLoad.strategyOptions,
      [STRATEGY_OPTIONS_KEYS.SYMBOL]: _find(markets, (m) => m.wsID === symbol),
      [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: String(capitalAllocation),
      [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: String(stopLossPerc),
      [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: String(maxDrawdownPerc),
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

export const isExecutionInputsFullFilled = (
  capitalAllocation,
  stopLossPerc,
  maxDrawdownPerc,
) => Number(capitalAllocation) > 0
  && Number(stopLossPerc) > 0
  && Number(maxDrawdownPerc) > 0

export const prepareChartTrades = (positions) => {
  return _reduce(positions, (trades, position) => {
    return [
      ...trades,
      ..._map(position?.trades, trade => ({
        ...trade,
        price: getTradePriceAvg(trade),
        amount: getTradeAmount(trade),
      })),
    ]
  }, [])
}

export const validateStrategyName = (label, t) => {
  const labelSize = _size(label)

  if (_isEmpty(label)) {
    return t('strategyEditor.newStrategyModalEmptyError')
  }

  if (labelSize > MAX_LABEL_LENGTH) {
    return t('strategyEditor.newStrategyModalLongError', {
      labelSize,
      MAX_LABEL_LENGTH,
    })
  }

  return ''
}
