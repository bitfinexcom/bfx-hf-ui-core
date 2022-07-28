import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getExecutionConnectionState = (state) => {
  const lostConnectionAt = _get(state, `${path}.execution.lostConnectionAt`, null)
  const _connectionLostDurationMs = _get(state, `${path}.execution.connectionLostDurationMs`)
  const connectionLostDurationMs = lostConnectionAt
    ? Date.now() - lostConnectionAt + _connectionLostDurationMs
    : _connectionLostDurationMs
  return {
    isExecutionConnected: _get(state, `${path}.execution.isConnected`),
    connectionLostDurationMs,
  }
}

export default getExecutionConnectionState
