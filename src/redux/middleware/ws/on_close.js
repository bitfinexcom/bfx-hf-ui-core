import _isNil from 'lodash/isNil'
import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import { getSocket } from '../../selectors/ws'

export default (alias, store) => () => {
  const state = store.getState()
  const socket = getSocket(state, alias)

  // do not show bad-connection-modal when connecting first time and it fails i.e. when lastActivity = null
  if (!_isNil(socket?.lastActivity)) {
    store.dispatch(UIActions.changeBadInternetConnectionState(true))
  }

  store.dispatch(WSActions.disconnected(alias))
}
