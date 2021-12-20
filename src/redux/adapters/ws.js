import _toUpper from 'lodash/toUpper'
import { Position, Notification } from 'bfx-api-node-models'

const positionAdapter = (data = []) => {
  return new Position(data).toJS()
}

const balanceAdapter = (data = []) => ({
  currency: data[0],
  context: data[1],
  balance: data[2],
  available: data[3],
})

const orderAdapter = (data = []) => ({
  id: data[0],
  gid: data[1],
  cid: data[2],
  symbol: data[3],
  created: data[4],
  amount: data[5],
  originalAmount: data[6],
  type: data[7],
  tif: data[8],
  status: data[9],
  price: data[10],
  priceAvg: data[11],
  priceTrailing: data[12],
  priceAuxLimit: data[13],
  hidden: data[14],
  postonly: data[15],
  oco: data[16],
  reduceonly: data[17],
  visibleOnHit: data[18],
  lev: data[19],
})

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
