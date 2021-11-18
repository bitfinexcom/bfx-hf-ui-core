import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getRemoteVersion, getIsBadInternetConnection } from '../../redux/selectors/ui'
import {
  apiClientConnected, apiClientConnecting, apiClientDisconnected, getCurrentModeAPIKeyState, isSocketConnected,
} from '../../redux/selectors/ws'
import StatusBar from './StatusBar'

const mapStateToProps = (state) => ({
  wsConnected: isSocketConnected(state),
  remoteVersion: getRemoteVersion(state),
  apiClientDisconnected: apiClientDisconnected(state),
  apiClientConnecting: apiClientConnecting(state),
  apiClientConnected: apiClientConnected(state),
  wsInterrupted: getIsBadInternetConnection(state),
  currentModeApiKeyState: getCurrentModeAPIKeyState(state),
})

const mapDispatchToProps = (dispatch) => ({
  changeFeedbackVisibility: (visible) => {
    dispatch(UIActions.changeFeedbackVisibilityState(visible))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(StatusBar)
