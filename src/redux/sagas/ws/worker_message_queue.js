import { put, select } from 'redux-saga/effects'
import _keys from 'lodash/keys'
import _some from 'lodash/some'
import Debug from 'debug'

import { getSockets } from '../../selectors/ws'
import WSTypes, { SOCKET_STATUS_MAP } from '../../constants/ws'

const debug = Debug('hfui:rx:s:ws-hfui:msg-q')
let queue = []

// Place every outgoing message in a queue if connection is offline
export default function* (action = {}) {
  const sockets = yield select(getSockets)
  const offline = _some(_keys(sockets), s => sockets[s].status !== SOCKET_STATUS_MAP.ONLINE && s !== WSTypes.ALIAS_PUB_WS_API)

  if (action.type !== WSTypes.FLUSH_QUEUE) {
    queue = [...queue, action]
  }

  if (offline || queue.length === 0) {
    return
  }

  debug('flushing %d messages', queue.length)

  for (let i = 0; i < queue.length; i += 1) {
    const queuedAction = queue[i]

    if (queuedAction.type === WSTypes.BUFF_SEND) {
      queuedAction.type = WSTypes.SEND
    }

    yield put(queuedAction)
  }

  queue = []
}
