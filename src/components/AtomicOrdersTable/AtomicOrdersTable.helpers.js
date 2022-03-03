import Debug from 'debug'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'

const debug = Debug('hfui:c:atomic-orders')

export const cancelOrder = (authToken, order, dispatch) => {
  const { id, symbol } = order

  debug('cancelling order %d [%s]', id, symbol)
  dispatch(WSActions.send(['order.cancel', authToken, 'bitfinex', symbol, id]))
  dispatch(GAActions.cancelAtomicOrder())
}
