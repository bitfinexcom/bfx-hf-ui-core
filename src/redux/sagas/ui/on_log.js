import { put, select } from 'redux-saga/effects'
import _toUpper from 'lodash/toUpper'
import _includes from 'lodash/includes'

import WSActions from '../../actions/ws'
import { isElectronApp } from '../../config'
import { getOptinCrashReports } from '../../selectors/ui'

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
  const optinCrashReports = yield select(getOptinCrashReports)

  const method = LEVEL_CONSOLE_MAPPING[level] || LEVEL_CONSOLE_MAPPING.info

  console[method](`${new Date().toISOString()} ${_toUpper(level)}: ${message}`)

  if (isElectronApp && ipcHelpers) {
    ipcHelpers?.dumpLogData(payload)
    return
  }

  const stringifiedPayload = JSON.stringify(payload)

  yield put(WSActions.send(['error_log.dump', stringifiedPayload]))

  if (optinCrashReports && _includes(METRICS_SERVER_LEVELS, level)) {
    yield put(WSActions.send(['fatal_error.log', level, stringifiedPayload]))
  }
}
