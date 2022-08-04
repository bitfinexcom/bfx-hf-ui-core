import { connect } from 'react-redux'
import _size from 'lodash/size'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import GAActions from '../../redux/actions/google_analytics'
import {
  getOrderToEdit, getMaxOrderCounts, getUIModalStateForKey,
} from '../../redux/selectors/ui'
import {
  getAuthToken, getFilteredAtomicOrdersCount, getAtomicOrders,
} from '../../redux/selectors/ws'
import { getMarkets } from '../../redux/selectors/meta'

import EditOrderModal from './EditOrderModal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  visible: getUIModalStateForKey(state, UI_MODAL_KEYS.EDIT_ORDER_MODAL),
  order: getOrderToEdit(state),
  authToken: getAuthToken(state),
  atomicOrdersCount: _size(getAtomicOrders(state)),
  countFilterAtomicOrdersByMarket: getFilteredAtomicOrdersCount(state),
  maxOrderCounts: getMaxOrderCounts(state),
  markets: getMarkets(state),
})

const mapDispatchToProps = dispatch => ({
  changeVisibilityState: (visible) => dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.EDIT_ORDER_MODAL, visible)),
  updateOrder: (authToken, order) => {
    dispatch(WSActions.send([
      'order.update', authToken, order,
    ]))
  },
  gaEditAO: () => {
    dispatch(GAActions.editAO())
  },
  cancelAlgoOrder: (authToken, gid) => {
    dispatch(WSActions.send(['algo_order.cancel', authToken, 'bitfinex', gid]))
  },
  submitAlgoOrder: (authToken, id, _symbol, _futures, _margin, data) => {
    dispatch(WSActions.submitAlgoOrder(authToken, id, {
      ...data, _symbol, _margin, _futures,
    }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(EditOrderModal)
