import { put } from 'redux-saga/effects'
import { v4 } from 'uuid'
import i18n from '../../../locales/i18n'

import A from '../../actions/ws'
import { getAuthToken } from '../../../util/token_store'
import WSTypes from '../../constants/ws'
import { isElectronApp } from '../../config'

export default function* ({ payload }) {
  const { alias } = payload
  yield put(A.flushQueue())

  yield put(A.recvNotification({
    mts: Date.now(),
    status: 'success',
    text: i18n.isInitialized ? i18n.t('notifications.wsConnected') : 'Successfully connected to websocket server',
    cid: v4(),
  }))

  if (!isElectronApp && alias === WSTypes.ALIAS_API_SERVER) {
    const token = getAuthToken()
    yield put(A.webAuth(token))
  }
}
