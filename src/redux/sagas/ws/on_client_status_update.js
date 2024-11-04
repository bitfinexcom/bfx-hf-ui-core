import _isEmpty from 'lodash/isEmpty'
import { put, select } from 'redux-saga/effects'

import { WS_CONNECTION } from '../../constants/ws'
import { UI_KEYS } from '../../constants/ui_keys'
import UIActions from '../../actions/ui'
import WSActions from '../../actions/ws'
import { UI_MODAL_KEYS } from '../../constants/modals'
import {
  getActiveStrategies,
  getFilteredLocalAlgoOrders,
  getSocket,
} from '../../selectors/ws'
import { getUIModalStateForKey } from '../../selectors/ui'
import { getAPIClientState } from '../../selectors/ws/api_client_state'

const LONG_TERM_CLOSED_SESSION_MODAL_DELAY = 30 * 60 * 1000 // 30m

function* longTermModalStateSwitch(state) {
  yield put(
    UIActions.changeUIModalState(
      UI_MODAL_KEYS.LONG_TERM_CLOSED_SESSION_MODAL,
      state,
    ),
  )
  yield put(
    UIActions.changeUIModalState(
      UI_MODAL_KEYS.LONG_TERM_CLOSED_SESSION_MODAL_ALREADY_SHOWN,
      state,
    ),
  )
}

export default function* onClientStatusUpdate({ payload }) {
  const { status } = payload

  const lastStatus = yield select(getAPIClientState)
  const activeStrategies = yield select(getActiveStrategies)
  const algoOrders = yield select(getFilteredLocalAlgoOrders)

  const isStatusChanged = status !== lastStatus

  const isLongTermClosedSessionModalAlreadyShown = yield select((state) => getUIModalStateForKey(
    state,
    UI_MODAL_KEYS.LONG_TERM_CLOSED_SESSION_MODAL_ALREADY_SHOWN,
  ),
  )

  if (status === WS_CONNECTION.CLOSED) {
    if (isStatusChanged) {
      yield put(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, true))
    }

    const socket = yield select(getSocket)
    if (
      (!_isEmpty(activeStrategies) || !_isEmpty(algoOrders))
      && !isLongTermClosedSessionModalAlreadyShown
      && socket?.lastActivity
      && Date.now() - socket.lastActivity >= LONG_TERM_CLOSED_SESSION_MODAL_DELAY
    ) {
      yield longTermModalStateSwitch(true)
    }
  }

  if (status === WS_CONNECTION.OPENED) {
    if (isStatusChanged) {
      yield put(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, false))
    }
    yield longTermModalStateSwitch(false)
  }

  yield put(WSActions.setAPIClientStatus(payload))
}
