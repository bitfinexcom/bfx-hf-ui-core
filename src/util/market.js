import _keys from 'lodash/keys'
import _first from 'lodash/first'
import _get from 'lodash/get'
import _includes from 'lodash/includes'
import _replace from 'lodash/replace'

export const getDefaultMarket = (markets) => _get(markets, [_first(_keys(markets))], 'uiID')

export const getPairFromMarket = (market, getCurrencySymbol, divider = '/') => (market?.isPerp ? market.uiID : `${getCurrencySymbol(market?.base)}${divider}${getCurrencySymbol(market?.quote)}`)

export const getCorrectIconNameOfPerpCcy = (perpCcy) => {
  const perpSuffix = 'F0'
  if (_includes(perpCcy, perpSuffix)) {
    return _replace(perpCcy, perpSuffix, '')
  }
  return perpCcy
}
