import { put, delay, select } from 'redux-saga/effects'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import UIActions from '../../actions/ui'
import WSActions from '../../actions/ws'
import { isElectronApp } from '../../config'

const PING_AND_CHECK_CONNECTION_INTERVAL_MS = 30 * 1000 // 30 seconds

export default function* () {
  while (true) {
    yield delay(PING_AND_CHECK_CONNECTION_INTERVAL_MS)
    const isWSconnected = yield select(reduxSelectors.getWSConnected)

    if (!isWSconnected) {
      yield put(UIActions.changeBadInternetConnectionState(true))
    } else if (!isElectronApp) { // send ping to bfx-hf-hosted every 30 ms
      yield put(WSActions.send({ event: 'ping' }))
    }
  }
}
