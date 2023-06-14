import _isNil from 'lodash/isNil'
import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import { getAuthToken, getSocket } from '../../selectors/ws'
import { isElectronApp, env } from '../../config'
import { UI_KEYS } from '../../constants/ui_keys'
import { LOG_LEVELS } from '../../../constants/logging'

export default (alias, store) => () => {
  const state = store.getState()
  const socket = getSocket(state, alias)
  const isLoggedIn = getAuthToken(state)

  // do not show bad-connection-modal when connecting first time and it fails i.e. when lastActivity = null
  // do not show in hosted mode since it re-attepmpts new connection
  // do not mark bad connection if user is still on login screen and ws onClose is triggered
  if (!_isNil(socket?.lastActivity) && isElectronApp && isLoggedIn) {
    store.dispatch(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, true))
  }

  if (env === 'electron') {
    // remote connection is closed
    store.dispatch(UIActions.logInformation(null, LOG_LEVELS.INFO, 'remote_connection_closed'))
  } else {
    // local connection is closed
    store.dispatch(UIActions.logInformation('WebSocket connection closed', LOG_LEVELS.INFO, 'local_connection_closed'))
  }
  store.dispatch(WSActions.disconnected(alias))
}
