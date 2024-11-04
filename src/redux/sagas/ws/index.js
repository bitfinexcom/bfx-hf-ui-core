import { fork, takeEvery, takeLatest } from 'redux-saga/effects'
import t from '../../constants/ws'

import connectionWorker from './worker_connection'
import messageQueueWorker from './worker_message_queue'
import pingRebootAppWorker from './worker_ping_reboot_app'
import orderClose from './order_close'
import balances from './data_balances'
import balance from './data_balance'
import orderHist from './data_order_hist'

import onConnected from './on_connected'
import onDisconnected from './on_disconnected'
import onResetData from './on_reset_data'
import onExportStrategiesBeforeReset from './on_export_strategies_before_reset_data.js'
import onAlgoOrderStopped from './on_ao_stopped'
import cancelAlgoOrder from './cancel_algo_order'
import onClientStatusUpdate from './on_client_status_update'

export default function* () {
  yield takeEvery(t.BUFF_SEND, messageQueueWorker)
  yield takeEvery(t.FLUSH_QUEUE, messageQueueWorker)
  yield takeEvery(t.CONNECTED, onConnected)
  yield takeEvery(t.DISCONNECTED, onDisconnected)
  yield takeEvery(t.DATA_ORDER_CLOSE_ASYNC, orderClose)
  yield takeEvery(t.DATA_BALANCES, balances)
  yield takeEvery(t.DATA_BALANCE, balance)
  yield takeEvery(t.DATA_ORDER_HIST, orderHist)
  yield takeEvery(t.AUTH_RESET_DATA, onResetData)
  yield takeEvery(t.DATA_ALGO_ORDER_STOPPED, onAlgoOrderStopped)
  yield takeLatest(t.EXPORT_STRATEGIES_ON_RESET, onExportStrategiesBeforeReset)
  yield takeEvery(t.CANCEL_ALGO_ORDER, cancelAlgoOrder)
  yield takeEvery(t.DATA_CLIENT_STATUS_UPDATE, onClientStatusUpdate)

  yield fork(connectionWorker)
  yield fork(pingRebootAppWorker)
}
