import { connect } from 'react-redux'
import Debug from 'debug'

import { getAuthToken, getAtomicOrders, getFilteredAtomicOrders } from '../../redux/selectors/ws'
import { getMarkets, getMarketPair } from '../../redux/selectors/meta'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import UIActions from '../../redux/actions/ui'

import AtomicOrdersTable from './AtomicOrdersTable'

const debug = Debug('hfui:c:atomic-orders-table')

const mapStateToProps = (state = {}, { activeFilter }) => ({
  authToken: getAuthToken(state),
  filteredAtomicOrders: getFilteredAtomicOrders(state)(activeFilter),
  atomicOrders: getAtomicOrders(state),
  getMarketPair: getMarketPair(state),
  markets: getMarkets(state),
})

const mapDispatchToProps = dispatch => ({
  cancelOrder: (authToken, order) => {
    const { id, symbol } = order

    debug('cancelling order %d [%s]', id, symbol)
    dispatch(WSActions.send(['order.cancel', authToken, 'bitfinex', symbol, id]))
  },
  gaCancelOrder: () => {
    dispatch(GAActions.cancelAtomicOrder())
  },
  editOrder: (order) => {
    dispatch(UIActions.changeEditOrderModalState(true, order))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AtomicOrdersTable)
