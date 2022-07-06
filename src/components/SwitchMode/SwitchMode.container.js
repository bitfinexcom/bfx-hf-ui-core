import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import { getIsPaperTrading, getThemeSetting } from '../../redux/selectors/ui'
import SwitchMode from './SwitchMode'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  changeTradingMode: (isPaperTrading) => {
    dispatch(WSActions.changeMode(isPaperTrading))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMode)
