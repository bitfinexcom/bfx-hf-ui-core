import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import { getIsPaperTrading, getIsTradingModeModalVisible, getThemeSetting } from '../../redux/selectors/ui'
import SwitchMode from './SwitchMode'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  isTradingModeModalVisible: getIsTradingModeModalVisible(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  openTradingModeModal: () => {
    console.log('@ foobar')
    dispatch(WSActions.changeMode())
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMode)
