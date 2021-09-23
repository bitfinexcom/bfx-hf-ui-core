import { fork, takeEvery } from 'redux-saga/effects'
import t from '../../constants/ws'

import connectionWorker from './worker_connection'
import messageQueueWorker from './worker_message_queue'
import pingConnection from './worker_ping_connection'

import onConnected from './on_connected'
import onDisconnected from './on_disconnected'

export default function* () {
  yield takeEvery(t.BUFF_SEND, messageQueueWorker)
  yield takeEvery(t.FLUSH_QUEUE, messageQueueWorker)
  yield takeEvery(t.CONNECTED, onConnected)
  yield takeEvery(t.DISCONNECTED, onDisconnected)

  yield fork(connectionWorker)
  yield fork(pingConnection)
}
