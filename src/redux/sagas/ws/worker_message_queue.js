import { delay, put, select } from 'redux-saga/effects'
import _keys from 'lodash/keys'
import _some from 'lodash/some'
import _includes from 'lodash/includes'
import Debug from 'debug'

import { getSockets } from '../../selectors/ws'
import WSTypes, { SOCKET_STATUS_MAP } from '../../constants/ws'
import UIActions from '../../actions/ui'
import { UI_MODAL_KEYS } from '../../constants/modals'

const debug = Debug('hfui:rx:s:ws-hfui:msg-q')
const ONLINE_ONLY_MESSAGES = [
  'order.submit',
  'algo_order.submit',
  'api_credentials.save',
  'strategy.execute_start',
  'settings.update',
]
let queue = []
let isQueueExecuting = false

export default function* messageQueueWorker(action = {}) {
  const sockets = yield select(getSockets)
  const offline = _some(
    _keys(sockets),
    (s) => sockets[s].status !== SOCKET_STATUS_MAP.ONLINE,
  )

  if (offline && _some(ONLINE_ONLY_MESSAGES, m => _includes(action.payload, m))) {
    yield put(UIActions.changeUIModalState(UI_MODAL_KEYS.NO_CONNECTION_MODAL, true))
    return
  }
  if (action.type !== WSTypes.FLUSH_QUEUE) {
    queue = [...queue, action]
    if (isQueueExecuting) {
      return
    }
  }

  if (offline || queue.length === 0) {
    return
  }
  isQueueExecuting = true
  debug('flushing %d messages')

  for (let i = 0; i < queue.length; i += 1) {
    const queuedAction = queue[i]

    if (queuedAction.type === WSTypes.BUFF_SEND) {
      queuedAction.type = WSTypes.SEND
    }
    yield delay(500)
    yield put(queuedAction)
  }

  queue = []
  isQueueExecuting = false
}
