import { connect } from 'react-redux'

import UIActions from '../../../redux/actions/ui'
import { getIsPaperTrading, getCurrentMode } from '../../../redux/selectors/ui'
import LaunchStrategyModal from './LaunchStrategyModal'
import WSActions from '../../../redux/actions/ws'
import { getAuthToken } from '../../../redux/selectors/ws'

const mapStateToProps = (state = {}) => ({
  isPaperTrading: getIsPaperTrading(state),
  authToken: getAuthToken(state),
  currentMode: getCurrentMode(state),
})

const mapDispatchToProps = dispatch => ({
  changeTradingMode: (isPaperTrading, authToken, currentMode) => {
    dispatch(UIActions.setTradingMode(isPaperTrading))
    dispatch(WSActions.send(['algo_order.pause', authToken, currentMode]))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(LaunchStrategyModal)
