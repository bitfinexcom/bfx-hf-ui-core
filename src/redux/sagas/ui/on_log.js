import { put, select } from 'redux-saga/effects'
import _toUpper from 'lodash/toUpper'
import _includes from 'lodash/includes'

import WSActions from '../../actions/ws'
import { appVersion } from '../../config'
import {
  getCurrentMode,
} from '../../selectors/ui'

const LEVEL_CONSOLE_MAPPING = {
  debug: 'debug',
  info: 'info',
  warn: 'warn',
  error: 'error',
  fatal: 'error',
}

const ENV_MAPPING = {
  paper: 'SANDBOX',
  main: 'LIVE',
}

const METRICS_SERVER_LEVELS = [
  'error', 'fatal',
]

export default function* ({ payload }) {
  const {
    message, level,
  } = payload
  const env = ENV_MAPPING[yield select(getCurrentMode)]

  const method = LEVEL_CONSOLE_MAPPING[level] || LEVEL_CONSOLE_MAPPING.info
  const localTime = new Date().toISOString()
  const timestamp = Math.floor(Date.now() / 1000) // in seconds

  if (message) {
    console[method](`${localTime} ${_toUpper(level)}: ${message}`)
  }

  const stringifiedPayload = JSON.stringify({
    ...payload,
    timestamp,
    localTime,
    version: appVersion,
    env,
  })

  yield put(WSActions.send(['error_log.dump', stringifiedPayload]))

  if (_includes(METRICS_SERVER_LEVELS, level)) {
    yield put(WSActions.send(['fatal_error.log', level, stringifiedPayload]))
  }
}
