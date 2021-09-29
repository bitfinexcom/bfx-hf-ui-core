import { put, delay, select } from 'redux-saga/effects'
import _keys from 'lodash/keys'

import Debug from 'debug'

import WSActions from '../../actions/ws'
import { isElectronApp } from '../../config'
import { getSockets } from '../../selectors/ws'
import { isDevEnv } from '../../../util/autologin'

import WSTypes, { SOCKET_STATUS_MAP } from '../../constants/ws'

const URLS = {
  [WSTypes.ALIAS_API_SERVER]: process.env.REACT_APP_WSS_URL,
  [WSTypes.ALIAS_DATA_SERVER]: process.env.REACT_APP_DS_URL,
}
const CHECK_CONNECTION_EVERY_MS = 10 * 1000 // 10 sec
const CHECK_CONNECTION_INITIAL_DELAY = 8 * 1000 // 8 sec
const debug = Debug('hfui:rx:s:ws-hfui:worker-connection')

export default function* () {
  // on app start, wait for port to open before attempting api/ds ws connection
  if (isElectronApp && !isDevEnv()) {
    yield delay(CHECK_CONNECTION_INITIAL_DELAY)
  }

  while (true) {
    const sockets = yield select(getSockets)
    const keys = _keys(sockets)

    for (let i = 0; i < keys.length; ++i) {
      const socket = keys[i]

      if (!isElectronApp && socket === WSTypes.ALIAS_DATA_SERVER) {
        // eslint-disable-next-line no-continue
        continue
      }

      if (sockets[socket].status === SOCKET_STATUS_MAP.OFFLINE) {
        debug(`attempting connection to ${socket}...`)
        yield put(WSActions.connect(socket, URLS[socket]))
      }
    }

    yield delay(CHECK_CONNECTION_EVERY_MS)
  }
}
