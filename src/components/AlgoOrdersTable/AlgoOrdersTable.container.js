import { connect } from 'react-redux'
import Debug from 'debug'

import {
  getCurrentModeAlgoOrders,
  getFilteredAlgoOrders,
  getOrderHistory,
  getAuthToken,
  getAtomicOrders,
} from '../../redux/selectors/ws'
import { getActiveMarket } from '../../redux/selectors/ui'
import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import AlgoOrdersTable from './AlgoOrdersTable'
import { getMarketPair } from '../../redux/selectors/meta'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { getShowAOsHistory } from '../../redux/selectors/ao'

const debug = Debug('hfui:c:algo-orders-table')

const mapStateToProps = (state = {}, { activeFilter }) => ({
  authToken: getAuthToken(state),
  algoOrders: getCurrentModeAlgoOrders(state),
  orders: getOrderHistory(state),
  atomicOrders: getAtomicOrders(state),
  filteredAlgoOrders: getFilteredAlgoOrders(state)(activeFilter),
  activeMarket: getActiveMarket(state),
  getMarketPair: getMarketPair(state),
  showHistory: getShowAOsHistory(state),
})

const mapDispatchToProps = (dispatch) => ({
  cancelOrder: (authToken, order) => {
    const { gid } = order

    debug('cancelling algo order %d', gid)
    dispatch(WSActions.send(['algo_order.cancel', authToken, 'bitfinex', gid]))
  },
  gaCancelOrder: () => {
    dispatch(GAActions.cancelAO())
  },
  editOrder: (order) => {
    dispatch(UIActions.setUIValue(UI_KEYS.orderToEdit, order))
    dispatch(
      UIActions.changeUIModalState(UI_MODAL_KEYS.EDIT_ORDER_MODAL, true),
    )
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AlgoOrdersTable)
