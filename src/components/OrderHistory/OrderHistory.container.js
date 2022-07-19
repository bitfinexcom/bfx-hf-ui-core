import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import { getAuthToken, getOrderHistory, getCurrentModeAPIKeyState } from '../../redux/selectors/ws'
import { getIsLoadingOrderHistData, getCurrentMode } from '../../redux/selectors/ui'
import OrderHistory from './OrderHistory'

const mapStateToProps = (state) => ({
  orders: getOrderHistory(state),
  authToken: getAuthToken(state),
  isLoadingOrderHistData: getIsLoadingOrderHistData(state),
  apiCredentials: getCurrentModeAPIKeyState(state),
  currentMode: getCurrentMode(state),
})

const mapDispatchToProps = dispatch => ({
  fetchOrderHistory: (authToken, endTime = null) => {
    dispatch(WSActions.send(['get.order_history', authToken, null, endTime, 100]))
  },
  setIsLoadingOrderHistFlag: () => dispatch(UIActions.setIsLoadingOrderHistData(true)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
