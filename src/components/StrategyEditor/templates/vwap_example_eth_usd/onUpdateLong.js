/* eslint-disable */

export default `({ HFS }) => async (state = {}, update = {}) => {
  const { price, mts } = update
  const iv = HFS.indicatorValues(state)
  const lastTrade = _.last(state.trades)
  const { vwap, s, l, roc } = iv
  
  if (lastTrade.tag === 'elvwap' && l - price > 0.7 && s > l) {
    return HFS.closePositionMarket(state, {
      price,
      mtsCreate: mts,
      label: 'close long | rev | l-p>1 & s<l',
      tag: 'clvwap',
    })
  } else if (lastTrade.tag === 'elspike' && price > s) {
    return HFS.closePositionMarket(state, {
      price,
      mtsCreate: mts,
      label: 'close long spike',
      tag: 'clspike',
    })
  } else if (lastTrade.tag === 'elrocspike' && price < s && price > vwap) {
    return HFS.closePositionMarket(state, {
      price,
      mtsCreate: mts,
      label: 'close long | rev | p<s',
      tag: 'clvwap',
    })
  } else if (lastTrade.tag === 'elr' && price > vwap) {
    return HFS.closePositionMarket(state, {
      price,
      mtsCreate: mts,
      label: 'close long vwap',
      tag: 'clvwap',
    })
  } else if (price < vwap) {
    return HFS.closePositionMarket(state, {
      price,
      mtsCreate: mts,
      label: 'close long vwap',
      tag: 'clvwap',
    })
  } else if ((price < vwap - 0.25 && s < l - 0.4) || roc > 2.1) {
    return HFS.closePositionMarket(state, {
      price,
      mtsCreate: mts,
      label: 'close long | rev | roc',
      tag: 'cl',
    })
  }
  
  return state
}`
