import { fork, takeEvery } from 'redux-saga/effects'
import t from '../../constants/ws'

import connectionWorker from './worker_connection'
import messageQueueWorker from './worker_message_queue'
import pingRebootAppWorker from './worker_ping_reboot_app'
import balances from './data_balances'
import balance from './data_balance'

import onConnected from './on_connected'
import onDisconnected from './on_disconnected'

export default function* () {
  yield takeEvery(t.BUFF_SEND, messageQueueWorker)
  yield takeEvery(t.FLUSH_QUEUE, messageQueueWorker)
  yield takeEvery(t.CONNECTED, onConnected)
  yield takeEvery(t.DISCONNECTED, onDisconnected)
  yield takeEvery(t.DATA_BALANCES, balances)
  yield takeEvery(t.DATA_BALANCE, balance)

  yield fork(connectionWorker)
  yield fork(pingRebootAppWorker)
}
