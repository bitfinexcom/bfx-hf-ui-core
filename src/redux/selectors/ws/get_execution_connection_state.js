import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getExecutionConnectionState = (state) => _get(state, `${path}.execution.isConnected`)

export default getExecutionConnectionState
