import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import { getAuthToken, getOrderHistory, getCurrentModeAPIKeyState } from '../../redux/selectors/ws'
import { getCurrentMode, getUIState } from '../../redux/selectors/ui'
import OrderHistory from './OrderHistory'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import getFormatTimeFn from '../../redux/selectors/ui/get_format_time_fn'

const mapStateToProps = (state) => ({
  orders: getOrderHistory(state),
  authToken: getAuthToken(state),
  isLoadingOrderHistData: getUIState(state, UI_KEYS.isLoadingOrderHistData, false),
  apiCredentials: getCurrentModeAPIKeyState(state),
  currentMode: getCurrentMode(state),
  formatTime: getFormatTimeFn(state),
})

const mapDispatchToProps = dispatch => ({
  fetchOrderHistory: (authToken, endTime = null) => {
    dispatch(WSActions.send(['get.order_history', authToken, null, endTime, 100]))
  },
  setIsLoadingOrderHistFlag: () => dispatch(UIActions.setUIValue(UI_KEYS.isLoadingOrderHistData, true)),
})

export default connect(mapStateToProps, mapDispatchToProps)(OrderHistory)
