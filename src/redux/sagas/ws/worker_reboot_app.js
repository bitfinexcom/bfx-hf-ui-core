import { put, delay, select } from 'redux-saga/effects'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import UIActions from '../../actions/ui'

const CHECK_CONNECTION_EVERY_MS = 30 * 1000 // 30 seconds

export default function* () {
  while (true) {
    yield delay(CHECK_CONNECTION_EVERY_MS)
    const isWSconnected = yield select(reduxSelectors.getWSConnected)

    if (!isWSconnected) {
      yield put(UIActions.changeBadInternetConnectionState(true))
    }
  }
}
