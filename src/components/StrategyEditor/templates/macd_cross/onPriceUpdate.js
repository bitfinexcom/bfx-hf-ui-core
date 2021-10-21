/* eslint-disable */

export default `const whenShort = async (state = {}, update = {}) => {
  const { price, mts } = update
  const { macd } = HFS.indicatorValues(state)

  if (macd.macd > macd.signal) {
    return HFS.closePositionMarket(state, { price, mtsCreate: mts })
  }

  return state
}

const whenLong = async (state = {}, update = {}) => {
  const { price, mts } = update
  const { macd } = HFS.indicatorValues(state)

  if (macd.macd < macd.signal) {
    return HFS.closePositionMarket(state, { price, mtsCreate: mts })
  }

  return state
}

const lookForTrade = async (state = {}, update = {}) => {
  const { price, mts } = update
  const { macd } = HFS.indicators(state)
  const current = macd.v()
  const previous = macd.prev()

  if (macd.l() < 2) {
    return state // await sufficient data
  }

  const crossedOver = (
    (current.macd >= current.signal) &&
    (previous.macd <= previous.signal)
  )

  if (crossedOver) {
    return HFS.openLongPositionMarket(state, {
      mtsCreate: mts,
      amount: 1,
      price
    })
  }

  const crossedUnder = (
    (current.macd <= current.signal) &&
    (previous.macd >= previous.signal)
  )

  if (crossedUnder) {
    return HFS.openShortPositionMarket(state, {
      mtsCreate: mts,
      amount: 1,
      price
    })
  }

  return state
}

({ HFS, HFU }) => async (state = {}, update = {}) => {
  const position = HFS.getPosition(state)

  if (!position) {
    return lookForTrade(state, update)
  }

  if (HFS.isLong(state)) {
    return whenLong(state, update)
  }

  if (HFS.isShort(state)) {
    return whenShort(state, update)
  }

  return state
}`
