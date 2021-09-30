import { put } from 'redux-saga/effects'
import { v4 } from 'uuid'
import { i18n } from '@ufx-ui/core'

import A from '../../actions/ws'
import { getAuthToken } from '../../../util/token_store'
import WSTypes from '../../constants/ws'
import { isElectronApp } from '../../config'

let wasConnected = false

export default function* ({ payload }) {
  yield put(A.flushQueue())

  if (wasConnected) {
    yield put(A.reconnected())
  }

  yield put(A.recvNotification({
    mts: Date.now(),
    status: 'success',
    text: i18n.t('notifications.wsConnected'),
    cid: v4(),
  }))

  if (!isElectronApp && payload.alias === WSTypes.ALIAS_API_SERVER) {
    const token = getAuthToken()
    yield put(A.webAuth(token))
  }

  wasConnected = true
}
