import { put } from 'redux-saga/effects'
import { v4 } from 'uuid'
import { i18n } from '@ufx-ui/core'
import WSActions from '../../actions/ws'

export default function* () {
  yield put(WSActions.recvNotification({
    mts: Date.now(),
    status: 'error',
    text: i18n.t('notifications.wsDisconnected'),
    cid: v4(),
  }))
}
