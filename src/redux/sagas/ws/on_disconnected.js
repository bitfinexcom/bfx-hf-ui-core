import { put } from 'redux-saga/effects'
import { v4 } from 'uuid'
import i18n from '../../../locales/i18n'
import WSActions from '../../actions/ws'

export default function* () {
  yield put(WSActions.recvNotification({
    mts: Date.now(),
    status: 'error',
    text: i18n.t('notifications.wsDisconnected'),
    cid: v4(),
  }))
}
