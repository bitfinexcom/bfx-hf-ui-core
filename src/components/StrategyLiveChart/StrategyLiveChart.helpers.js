import memoizeOne from 'memoize-one'
import _map from 'lodash/map'
import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'

const generateCustomStudyName = (name, args) => {
  if (_isEmpty(args)) {
    return `${name}_`
  }
  return `${name} ${args.join(' ')}`
}
export const prepareTVIndicators = (indicators) => {
  return _map(indicators, (i) => {
    const transformed = [
      ...i,
    ]

    const instance = i[0] && new i[0]()
    const name = instance?.label
    transformed[0] = name
    transformed[3] = generateCustomStudyName(name, transformed[1])
    return transformed
  })
}

export const getStrategyMarket = memoizeOne((markets, strategyWSID) => {
  const {
    wsID, uiID, base, quote, isPerp,
  } = _find(markets, (market) => market.wsID === strategyWSID, null) || {}
  return {
    wsID, uiID, base, quote, isPerp,
  }
})
