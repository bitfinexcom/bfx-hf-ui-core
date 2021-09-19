import _get from 'lodash/get'
import _reduce from 'lodash/reduce'
import _map from 'lodash/map'
import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'
import { createSelector } from 'reselect'
import { reduxSelectors, prepareTickers } from '@ufx-ui/bfx-containers'
import getMarkets from './get_markets'
import getTickersKeys from './get_tickers_keys'
import { getTickersVolumeUnit } from '../ui'
import { getPairFromMarket } from '../../../util/market'

const { getCurrencySymbolMemo, getTickers } = reduxSelectors

const getTickersInfo = createSelector([getTickers, getMarkets, getCurrencySymbolMemo], (tickers, markets, getCurrencySymbol) => {
  const fullTickersData = _reduce(markets, (acc, market) => {
    const {
      wsID, base, quote, uiID, ccyLabels, isPerp,
    } = market
    const id = getPairFromMarket(market, getCurrencySymbol)
    const newTickerObject = {
      id,
      baseCcy: base,
      quoteCcy: quote,
      changePerc: _get(tickers, `${wsID}.changePerc`, 0),
      lastPrice: _get(tickers, `${wsID}.lastPrice`, 0),
      volume: _get(tickers, `${wsID}.volume`, 0),
      ccyLabels,
      wsID,
      isPerp,
      perpUI: isPerp ? uiID : null,
    }

    acc[wsID] = newTickerObject
    return acc
  }, {})

  return fullTickersData
})

const preparedTickersArray = createSelector(
  [
    getTickersInfo,
    getTickersKeys,
    getTickers,
    getCurrencySymbolMemo,
    getTickersVolumeUnit,
  ],
  (tickersInfo, tickersKeys, tickers, getCurrencySymbol, tickersVolumeUnit) => {
    if (_isEmpty(tickersInfo)) {
      return []
    }
    const prepared = prepareTickers(tickersKeys, tickers, tickersVolumeUnit, getCurrencySymbol)

    return _map(tickersKeys, (pair) => {
      const ticker = tickersInfo[pair]
      const preparedTicker = _find(prepared, (_ticker) => {
        return _ticker.id === ticker.wsID
      },
      null)
      return { ...ticker, volume: preparedTicker ? preparedTicker.volumeConverted : ticker.volume }
    })
  },
)
export default preparedTickersArray
