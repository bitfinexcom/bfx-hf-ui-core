import _toUpper from 'lodash/toUpper'
import { Position, Notification } from 'bfx-api-node-models'

const positionAdapter = (data = []) => {
  return new Position(data).toJS()
}

const balanceAdapter = (data = [], getCurrencySymbol = () => {}) => ({
  currency: data[0],
  context: data[1],
  balance: data[2],
  available: data[3],
  symbol: getCurrencySymbol(data[0]),
})

const orderAdapter = (order = {}, getMarketPair = () => {}) => {
  return {
    ...order,
    created: order.mtsCreate,
    originalAmount: order.amountOrig,
    tif: !!order.mtsTIF,
    tifDate: new Date(order.mtsTIF),
    priceAverage: order.priceAvg,
    pair: getMarketPair(order.symbol),
  }
}

const AOAdapter = (data = []) => ({
  gid: data[0],
  name: data[1],
  label: data[2],
  args: data[3],
  createdAt: data[4],
})

const notificationAdapter = (data = []) => {
  if (data[1] === 'ucm-notify-ui') { // HF notification
    return {
      mts: data[0],
      type: data[1],
      status: _toUpper(data[4].level),
      level: _toUpper(data[4].level),
      text: data[4].message,
      message: data[4].message,
    }
  }
  const notification = new Notification(data).toJS()
  notification.cid = data.cid || data.uid
  notification.i18n = data.i18n || null
  notification.level = data.status
  notification.message = data.text

  return notification
}

export {
  notificationAdapter,
  positionAdapter,
  balanceAdapter,
  orderAdapter,
  AOAdapter,
}
