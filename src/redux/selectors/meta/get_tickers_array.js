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

const tickersSelector = state => reduxSelectors.getTickers(state)
const getCurrencySymbol = state => reduxSelectors.getCurrencySymbolMemo(state)
const tickersVolumeUnit = state => getTickersVolumeUnit(state)

const getTickersInfo = createSelector([tickersSelector, getMarkets], (tickers, markets) => {
  const fullTickersData = _reduce(markets, (acc, market) => {
    const {
      wsID, base, quote, uiID, ccyLabels, isPerp,
    } = market
    const newTickerObject = {
      id: uiID,
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
    tickersSelector,
    getCurrencySymbol,
    tickersVolumeUnit,
  ],
  (tickersInfo, tickersKeys, tickers, _getCurrencySymbol, _tickersVolumeUnit) => {
    if (_isEmpty(tickersInfo)) {
      return []
    }
    const prepared = prepareTickers(tickersKeys, tickers, _tickersVolumeUnit, _getCurrencySymbol)

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
