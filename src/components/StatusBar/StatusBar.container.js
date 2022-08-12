import { connect } from 'react-redux'

import StatusBar from './StatusBar'
import {
  getRemoteVersion, getIsPaperTrading, getIsBetaVersion, getUIState,
} from '../../redux/selectors/ui'
import {
  apiClientConnected, apiClientConnecting, apiClientDisconnected, getCurrentModeAPIKeyState, isSocketConnected,
} from '../../redux/selectors/ws'
import { UI_KEYS } from '../../redux/constants/ui_keys'

const mapStateToProps = (state) => ({
  wsConnected: isSocketConnected(state),
  remoteVersion: getRemoteVersion(state),
  apiClientDisconnected: apiClientDisconnected(state),
  apiClientConnecting: apiClientConnecting(state),
  apiClientConnected: apiClientConnected(state),
  wsInterrupted: getUIState(state, UI_KEYS.isBadInternetConnection, false),
  currentModeApiKeyState: getCurrentModeAPIKeyState(state),
  isPaperTrading: getIsPaperTrading(state),
  isBetaVersion: getIsBetaVersion(state),
})

export default connect(mapStateToProps)(StatusBar)
