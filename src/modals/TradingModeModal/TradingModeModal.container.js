import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getAuthToken } from '../../redux/selectors/ws'
import {
  getCurrentMode,
  getIsPaperTrading,
  getIsTradingModeModalVisible,
} from '../../redux/selectors/ui'

import TradingModeModal from './TradingModeModal'

const mapStateToProps = (state = {}) => ({
  authToken: getAuthToken(state),
  currentMode: getCurrentMode(state),
  isPaperTrading: getIsPaperTrading(state),
  isTradingModeModalVisible: getIsTradingModeModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  changeTradingModeModalState: (isVisible) => dispatch(UIActions.changeTradingModeModalState(isVisible)),
  changeTradingMode: (isPaperTrading) => {
    dispatch(UIActions.setTradingMode(isPaperTrading))
    dispatch(WSActions.changeMode())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(TradingModeModal)
