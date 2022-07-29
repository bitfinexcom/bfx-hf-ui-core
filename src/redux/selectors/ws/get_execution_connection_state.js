import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getExecutionState = (state) => _get(state, `${path}.execution`, {})

const getExecutionConnectionState = createSelector(
  [getExecutionState],
  (execution) => {
    const lostConnectionAt = _get(execution, 'lostConnectionAt', null)
    const _connectionLostDurationMs = _get(
      execution,
      'connectionLostDurationMs',
    )
    const connectionLostDurationMs = lostConnectionAt
      ? Date.now() - lostConnectionAt + _connectionLostDurationMs
      : _connectionLostDurationMs
    return {
      isExecutionConnected: _get(execution, 'isConnected'),
      connectionLostDurationMs,
    }
  },
)

export default getExecutionConnectionState
