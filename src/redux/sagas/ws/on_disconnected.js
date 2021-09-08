import { put } from 'redux-saga/effects'
import { v4 } from 'uuid'
import WSActions from '../../actions/ws'

export default function* () {
  yield put(WSActions.recvNotification({
    mts: Date.now(),
    status: 'error',
    text: 'notifications.wsDisconnected',
    cid: v4(),
  }))
}
