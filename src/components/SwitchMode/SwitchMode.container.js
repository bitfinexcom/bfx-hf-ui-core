import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import {
  getCurrentMode,
  getIsPaperTrading, getIsTradingModeModalVisible, getThemeSetting,
} from '../../redux/selectors/ui'
import { getAuthToken } from '../../redux/selectors/ws'
import SwitchMode from './SwitchMode'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  authToken: getAuthToken(state),
  currentMode: getCurrentMode(state),
  isTradingModeModalVisible: getIsTradingModeModalVisible(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  changeAppMode: (isPaperTrading, authToken, currentMode) => {
    dispatch(UIActions.setIsChangingAppMode(true))
    dispatch(UIActions.setTradingMode(isPaperTrading))
    dispatch(WSActions.send(['algo_order.pause', authToken, currentMode]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMode)
