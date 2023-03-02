import { put, select } from 'redux-saga/effects'
import _toUpper from 'lodash/toUpper'

import WSActions from '../../actions/ws'
import { getSockets } from '../../selectors/ws'
import { isElectronApp } from '../../config'
import WSTypes, { SOCKET_STATUS_MAP } from '../../constants/ws'

const ipcHelpers = window.electronService

const LEVEL_CONSOLE_MAPPING = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
}

const METRICS_SERVER_LEVELS = [
  'error', 'fatal',
]

export default function* ({ payload }) {
  const {
    message, level,
  } = payload
  const sockets = yield select(getSockets)

  const method = LEVEL_CONSOLE_MAPPING[level] || LEVEL_CONSOLE_MAPPING.info

  console[method](`${new Date().toISOString()} ${_toUpper(level)}: ${message}`)

  if (sockets[WSTypes.ALIAS_API_SERVER].status !== SOCKET_STATUS_MAP.ONLINE && isElectronApp && ipcHelpers) {
    ipcHelpers?.dumpLogData(payload)
    return
  }

  yield put(WSActions.send(['error_log.dump', JSON.stringify(payload)]))

  if (_includes(METRICS_SERVER_LEVELS, level)) {
    yield put(WSActions.send(['fatal_error.log', level, JSON.stringify(payload)]))
  }
}
