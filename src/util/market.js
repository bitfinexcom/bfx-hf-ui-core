import _keys from 'lodash/keys'
import _first from 'lodash/first'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import _replace from 'lodash/replace'
import _isObject from 'lodash/isObject'
import {
  MAIN_MODE,
  PAPER_MODE,
} from '../redux/reducers/ui'

const PAPER_PAIR_PREFIX = 'TEST'
const PERP_SUFFIX = 'F0'

export const getDefaultMarket = (markets) => _get(markets, [_first(_keys(markets))], 'uiID')

export const getPairFromMarket = (market, getCurrencySymbol, divider = '/') => (market?.isPerp
  ? market.uiID
  : `${getCurrencySymbol(market?.base)}${divider}${getCurrencySymbol(
    market?.quote,
  )}`)

export const getCorrectIconNameOfPerpCcy = (perpCcy) => {
  if (_includes(perpCcy, PERP_SUFFIX)) {
    return _replace(perpCcy, PERP_SUFFIX, '')
  }
  return perpCcy
}

export const getIsPaperPair = (symbol) => _includes(_isObject(symbol) ? symbol?.wsID : symbol, PAPER_PAIR_PREFIX)

export const getStrategyModeForSymbol = (symbol) => (getIsPaperPair(symbol) ? PAPER_MODE : MAIN_MODE)
