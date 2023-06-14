import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import { LOG_LEVELS } from '../../../constants/logging'

export default (alias, store) => () => {
  store.dispatch(UIActions.logInformation('WebSocket connection was established', LOG_LEVELS.INFO, 'local_connection_success'))
  store.dispatch(WSActions.connected(alias))
}
