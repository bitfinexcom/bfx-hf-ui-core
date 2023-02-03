import { takeEvery, fork } from 'redux-saga/effects'

import UITypes from '../../constants/ui'
import WSTypes from '../../constants/ws'

import onChangeActiveMarket from './on_change_active_market'
import onSaveSettings from './on_save_settings'
import workerFetchRemoteVersion from './worker_fetch_remote_version'
import onChangeMode from './on_change_mode'
import onRemoveStrategy from './on_remove_strategy'
import onShowNotification from './on_show_notification'
import pendoIdentify from './pendo_identify'
import onLog from './on_log'
import { isElectronApp } from '../../config'

export default function* () {
  yield fork(workerFetchRemoteVersion)
  yield takeEvery(UITypes.SET_ACTIVE_MARKET, onChangeActiveMarket)
  yield takeEvery(UITypes.SAVE_SETTINGS, onSaveSettings)
  yield takeEvery(UITypes.CHANGE_MODE, onChangeMode)
  yield takeEvery(UITypes.REMOVE_STRATEGY, onRemoveStrategy)
  yield takeEvery(WSTypes.SET_AUID, pendoIdentify)
  yield takeEvery(UITypes.LOG, onLog)

  if (isElectronApp) {
    yield takeEvery(UITypes.DATA_NOTIFICATION, onShowNotification)
    yield takeEvery(WSTypes.DATA_NOTIFICATION, onShowNotification)
  }
}
