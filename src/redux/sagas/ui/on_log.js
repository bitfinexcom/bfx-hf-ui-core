import { put } from 'redux-saga/effects'
import _toUpper from 'lodash/toUpper'
import _includes from 'lodash/includes'
import WSActions from '../../actions/ws'

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

  const method = LEVEL_CONSOLE_MAPPING[level] || LEVEL_CONSOLE_MAPPING.info

  console[method](`${new Date().toISOString()} ${_toUpper(level)}: ${message}`)

  if (_includes(METRICS_SERVER_LEVELS, level)) {
    yield put(WSActions.send(['error_log.dump', payload]))
  }
}
