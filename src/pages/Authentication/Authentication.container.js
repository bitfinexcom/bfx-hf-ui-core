import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import { isSocketConnected, getAuthConfigured } from '../../redux/selectors/ws'
import Authentication from './Authentication'
import { PAPER_MODE } from '../../redux/reducers/ui'
import { removeStoredPassword, updateAutoLoginState } from '../../util/autologin'
import WS from '../../redux/constants/ws'

const mapStateToProps = (state = {}) => {
  const { isPaperTrading } = state.ui

  return {
    wsConnected: isSocketConnected(state, WS.ALIAS_API_SERVER) && isSocketConnected(state, WS.ALIAS_DATA_SERVER),
    configured: getAuthConfigured(state),
    isPaperTrading,
  }
}

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
  onInit: (password) => {
    dispatch(UIActions.setTradingMode(false))
    removeStoredPassword(password)
    updateAutoLoginState()
    dispatch(WSActions.initAuth(password))
  },
  onUnlock: (password, mode) => {
    const isPaperTrading = mode === PAPER_MODE
    dispatch(WSActions.auth(password, mode))
    dispatch(UIActions.setMarketFromStore(isPaperTrading))
    dispatch(UIActions.setTradingMode(isPaperTrading))
  },
  logInformation: (message, level, action, trace) => {
    dispatch(UIActions.logInformation(message, level, action, trace))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Authentication)
