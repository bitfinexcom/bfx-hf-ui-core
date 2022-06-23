import memoizeOne from 'memoize-one'
import _map from 'lodash/map'
import _find from 'lodash/find'

export const prepareTVIndicators = (indicators) => {
  return _map(indicators, (i) => {
    const transformed = [
      ...i,
    ]

    const instance = i[0] && new i[0]()
    let name = instance?.label
    if (instance?.label === 'EMA') {
      name = 'Moving Average Exponential'
    } else if (instance?.label === 'ROC') {
      name = 'Rate Of Change'
    }
    transformed[0] = name

    if (instance?.label === 'MACD') {
      transformed[1] = [
        transformed?.[1]?.[0],
        transformed?.[1]?.[1],
        'close',
        transformed?.[1]?.[2],
      ]
    }
    return transformed
  })
}

export const getStrategyMarket = memoizeOne((markets, strategyWSID) => {
  const {
    wsID, uiID, base, quote,
  } = _find(markets, (market) => market.wsID === strategyWSID, null) || {}
  return {
    wsID, uiID, base, quote,
  }
})
