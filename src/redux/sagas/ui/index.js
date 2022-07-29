import { takeEvery, fork } from 'redux-saga/effects'

import UITypes from '../../constants/ui'

import onChangeActiveMarket from './on_change_active_market'
import onSaveSettings from './on_save_settings'
import workerFetchRemoteVersion from './worker_fetch_remote_version'
import onChangeMode from './on_change_mode'

export default function* () {
  yield fork(workerFetchRemoteVersion)
  yield takeEvery(UITypes.SET_ACTIVE_MARKET, onChangeActiveMarket)
  yield takeEvery(UITypes.SAVE_SETTINGS, onSaveSettings)
  yield takeEvery(UITypes.CHANGE_MODE, onChangeMode)
}
