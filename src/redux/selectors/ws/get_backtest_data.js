import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS
const EMPTY_ARR = []

export default (state) => {
  const trades = _get(state, `${path}.backtest.trades`, EMPTY_ARR)
  const candles = _get(state, `${path}.backtest.candles`, EMPTY_ARR)
  return { trades, candles }
}
