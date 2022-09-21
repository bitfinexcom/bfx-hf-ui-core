import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getIsPaperTrading, getThemeSetting } from '../../redux/selectors/ui'
import SwitchMode from './SwitchMode'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  settingsTheme: getThemeSetting(state),
})

const mapDispatchToProps = dispatch => ({
  changeTradingMode: (isPaperTrading) => {
    dispatch(UIActions.changeMode(isPaperTrading))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchMode)
