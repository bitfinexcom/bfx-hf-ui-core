import _isNil from 'lodash/isNil'
import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import { getAuthToken, getSocket } from '../../selectors/ws'
import { isElectronApp } from '../../config'

export default (alias, store) => () => {
  const state = store.getState()
  const socket = getSocket(state, alias)
  const isLoggedIn = !!getAuthToken(state)

  // do not show bad-connection-modal when connecting first time and it fails i.e. when lastActivity = null
  // do not show in hosted mode since it re-attepmpts new connection
  // do not mark bad connection if user is still on login screen and ws onClose is triggered
  if (!_isNil(socket?.lastActivity) && isElectronApp && isLoggedIn) {
    store.dispatch(UIActions.changeBadInternetConnectionState(true))
  }

  store.dispatch(WSActions.disconnected(alias))
}
