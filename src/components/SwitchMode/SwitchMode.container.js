import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getIsPaperTrading, getIsTradingModeModalVisible, getThemeSetting } from '../../redux/selectors/ui'
import SwitchMode from './SwitchMode'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  isTradingModeModalVisible: getIsTradingModeModalVisible(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  openTradingModeModal: () => {
    dispatch(UIActions.changeTradingModeModalState(true))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMode)
