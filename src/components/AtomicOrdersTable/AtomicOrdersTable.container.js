import { connect } from 'react-redux'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getAuthToken, getAtomicOrders, getFilteredAtomicOrders } from '../../redux/selectors/ws'
import { getMarketPair } from '../../redux/selectors/meta'
import UIActions from '../../redux/actions/ui'

import AtomicOrdersTable from './AtomicOrdersTable'
import { cancelOrder } from './AtomicOrdersTable.helpers'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const { getIsDerivativePair } = reduxSelectors

const mapStateToProps = (state = {}, { activeFilter }) => ({
  authToken: getAuthToken(state),
  filteredAtomicOrders: getFilteredAtomicOrders(state)(activeFilter),
  atomicOrders: getAtomicOrders(state),
  getMarketPair: getMarketPair(state),
  getIsDerivativePair: getIsDerivativePair(state),
})

const mapDispatchToProps = dispatch => ({
  cancelOrder: (authToken, order) => cancelOrder(authToken, order, dispatch),
  editOrder: (order) => {
    dispatch(UIActions.setUIValue(UI_KEYS.orderToEdit, order))
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.EDIT_ORDER_MODAL, true))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AtomicOrdersTable)
