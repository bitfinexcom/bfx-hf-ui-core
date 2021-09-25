import { connect } from 'react-redux'

import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import { getSocket, getAuthConfigured } from '../../redux/selectors/ws'
import Authentication from './Authentication'
import { PAPER_MODE, IS_PAPER_TRADING } from '../../redux/reducers/ui'
import { removeStoredPassword, updateAutoLoginState } from '../../util/autologin'

const mapStateToProps = (state = {}) => {
  const socket = getSocket()(state)
  const { status: wsStatus } = socket
  const { isPaperTrading } = state.ui

  return {
    wsConnected: wsStatus === 'online',
    configured: getAuthConfigured(state),
    isPaperTrading,
  }
}

const mapDispatchToProps = dispatch => ({ // eslint-disable-line
  onInit: (password) => {
    dispatch(UIActions.setTradingMode(false))
    dispatch(WSActions.initAuth(password))
    dispatch(UIActions.firstLogin())
  },

  onUnlock: (password, mode) => {
    const isPaperTrading = mode === PAPER_MODE
    dispatch(WSActions.auth(password, mode))
    dispatch(UIActions.setMarketFromStore(isPaperTrading))
    dispatch(UIActions.setTradingMode(isPaperTrading))
  },

  onReset: () => {
    removeStoredPassword()
    updateAutoLoginState()
    dispatch(WSActions.resetAuth())
    window.localStorage.setItem(IS_PAPER_TRADING, false)
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(Authentication)
