import PropTypes from 'prop-types'
import { STRATEGY_OPTIONS_KEYS } from '../components/StrategyEditor/StrategyEditor.helpers'
import timeFrames from '../util/time_frames'

export const MARKET_SHAPE = {
  exchange: PropTypes.string,
  lev: PropTypes.number,
  quote: PropTypes.string,
  base: PropTypes.string,
  wsID: PropTypes.string,
  restID: PropTypes.string,
  uiID: PropTypes.string,
  contexts: PropTypes.arrayOf(PropTypes.string),
  p: PropTypes.number,
  minSize: PropTypes.number,
  maxSize: PropTypes.number,
  isPerp: PropTypes.bool,
  ccyLabels: PropTypes.arrayOf(PropTypes.string),
}

export const TICKER_SHAPE = {
  bid: PropTypes.number,
  bidSize: PropTypes.number,
  ask: PropTypes.number,
  askSize: PropTypes.number,
  change: PropTypes.number,
  changePerc: PropTypes.number,
  lastPrice: PropTypes.number,
  volume: PropTypes.number,
  volumeConverted: PropTypes.number,
  high: PropTypes.number,
  low: PropTypes.number,
}

export const STRATEGY_SHAPE = {
  id: PropTypes.string,
  label: PropTypes.string,
  strategyContent: PropTypes.objectOf(PropTypes.string),
  strategyOptions: PropTypes.shape({
    [STRATEGY_OPTIONS_KEYS.SYMBOL]: PropTypes.oneOfType([
      PropTypes.shape(MARKET_SHAPE),
      PropTypes.string,
    ]),
    [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: PropTypes.oneOf(timeFrames),
    [STRATEGY_OPTIONS_KEYS.TRADES]: PropTypes.bool,
    [STRATEGY_OPTIONS_KEYS.CANDLES]: PropTypes.bool,
    [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: PropTypes.number,
    [STRATEGY_OPTIONS_KEYS.START_DATE]: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]),
    [STRATEGY_OPTIONS_KEYS.END_DATE]: PropTypes.oneOfType([
      PropTypes.instanceOf(Date),
      PropTypes.string,
    ]),
    [STRATEGY_OPTIONS_KEYS.MARGIN]: PropTypes.bool,
    [STRATEGY_OPTIONS_KEYS.CAPITAL_ALLOCATION]: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    [STRATEGY_OPTIONS_KEYS.STOP_LOSS_PERC]: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    [STRATEGY_OPTIONS_KEYS.MAX_DRAWDOWN_PERC]: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    [STRATEGY_OPTIONS_KEYS.STRATEGY_TYPE]: PropTypes.shape({
      customValue: PropTypes.string,
      i18nKey: PropTypes.string,
    }),
  }),
  executionId: PropTypes.string,
  startedOn: PropTypes.number,
  stoppedOn: PropTypes.number,
  savedTs: PropTypes.number,
}

export const STRATEGY_TRADE_SHAPE = {
  order_id: PropTypes.number,
  amount: PropTypes.number,
  order_js: PropTypes.shape({
    type: PropTypes.string,
    mtsCreate: PropTypes.number,
    mtsUpdate: PropTypes.number,
    price: PropTypes.number,
    priceAvg: PropTypes.number,
  }),
}

export const ORDER_SHAPE = {
  id: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  gid: PropTypes.oneOfType([
    PropTypes.string, PropTypes.number,
  ]),
  cid: PropTypes.number,
  symbol: PropTypes.string,
  created: PropTypes.number,
  mtsUpdate: PropTypes.number,
  amount: PropTypes.number,
  originalAmount: PropTypes.number,
  type: PropTypes.string,
  tif: PropTypes.bool,
  tifDate: PropTypes.instanceOf(Date),
  status: PropTypes.string,
  price: PropTypes.number,
  priceAverage: PropTypes.number,
  priceTrailing: PropTypes.number,
  priceAuxLimit: PropTypes.number,
  hidden: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.number,
  ]),
  postonly: PropTypes.bool,
  oco: PropTypes.bool,
  reduceonly: PropTypes.bool,
  visibleOnHit: PropTypes.bool,
  lev: PropTypes.number,
  pair: PropTypes.string,
}

export const BALANCE_SHAPE = {
  currency: PropTypes.string,
  context: PropTypes.string,
  balance: PropTypes.number,
  available: PropTypes.number,
  symbol: PropTypes.string,
}

export const NOTIFICATION_SHAPE = {
  mts: PropTypes.number,
  type: null,
  messageID: null,
  notifyInfo: null,
  code: null,
  status: PropTypes.string,
  text: PropTypes.string,
  cid: PropTypes.string,
  i18n: PropTypes.shape({
    key: PropTypes.string,
  }),
  level: PropTypes.string,
  message: PropTypes.string,
}

export const POSITION_SHAPE = {
  symbol: PropTypes.string,
  status: PropTypes.string,
  amount: PropTypes.number,
  basePrice: PropTypes.number,
  marginFunding: PropTypes.number,
  marginFundingType: PropTypes.number,
  pl: PropTypes.number,
  plPerc: PropTypes.number,
  liquidationPrice: PropTypes.number,
  leverage: PropTypes.number,
  id: PropTypes.number,
  mtsCreate: PropTypes.number,
  mtsUpdate: PropTypes.number,
  type: PropTypes.number,
  collateral: PropTypes.number,
  collateralMin: PropTypes.number,
}

export const TRADE_SHAPE = {
  id: PropTypes.number,
  mts: PropTypes.number,
  amount: PropTypes.number,
  price: PropTypes.number,
}

export const STRATEGY_LAYOUT_CONFIG_SHAPE = {
  i: PropTypes.string,
  x: PropTypes.number,
  y: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
}

export const INDICATORS_ARRAY_SHAPE = PropTypes.array
