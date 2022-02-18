import { connect } from 'react-redux'

import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getAuthToken, getAtomicOrders, getFilteredAtomicOrders } from '../../redux/selectors/ws'
import { getMarketPair } from '../../redux/selectors/meta'
import UIActions from '../../redux/actions/ui'

import AtomicOrdersTable from './AtomicOrdersTable'
import { cancelOrder } from './AtomicOrdersTable.helpers'

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
    dispatch(UIActions.changeEditOrderModalState(true, order))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(AtomicOrdersTable)
