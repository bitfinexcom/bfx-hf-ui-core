import { connect } from 'react-redux'

import StatusBar from './StatusBar'
import { getRemoteVersion, getIsBadInternetConnection, getIsPaperTrading } from '../../redux/selectors/ui'
import {
  apiClientConnected, apiClientConnecting, apiClientDisconnected, getCurrentModeAPIKeyState, isSocketConnected,
} from '../../redux/selectors/ws'

const mapStateToProps = (state) => ({
  wsConnected: isSocketConnected(state),
  remoteVersion: getRemoteVersion(state),
  apiClientDisconnected: apiClientDisconnected(state),
  apiClientConnecting: apiClientConnecting(state),
  apiClientConnected: apiClientConnected(state),
  wsInterrupted: getIsBadInternetConnection(state),
  currentModeApiKeyState: getCurrentModeAPIKeyState(state),
  isPaperTrading: getIsPaperTrading(state),
})

export default connect(mapStateToProps)(StatusBar)
