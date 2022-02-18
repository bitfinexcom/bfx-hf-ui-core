import { prepareAmount } from 'bfx-api-node-util'
import Debug from 'debug'

import orders from '../../orders'
import WSActions from '../../redux/actions/ws'

const debug = Debug('hfui:c:positions')

export const closePosition = (authToken, position = {}, dispatch) => {
  const { symbol, amount, basePrice } = position
  const { generateOrder } = orders.Market()

  const packet = generateOrder({
    amount: prepareAmount(-1 * amount),
    reduceonly: true,
  }, symbol, 'm')

  debug('closing position on %s %f @ %f', symbol, amount, basePrice)
  dispatch(WSActions.submitOrder(authToken, packet))
}
