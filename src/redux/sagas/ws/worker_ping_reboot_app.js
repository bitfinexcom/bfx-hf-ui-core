import { put, delay } from 'redux-saga/effects'
import WSActions from '../../actions/ws'
import { isElectronApp } from '../../config'

const PING_AND_CHECK_CONNECTION_INTERVAL_MS = 30 * 1000 // 30 seconds

export default function* () {
  while (true) {
    yield delay(PING_AND_CHECK_CONNECTION_INTERVAL_MS)

    if (!isElectronApp) { // send ping to bfx-hf-hosted every 30 ms
      yield put(WSActions.send({ event: 'ping' }))
    }
  }
}
