import { put, select } from 'redux-saga/effects'
import UIActions from '../../actions/ui'
import { UI_KEYS } from '../../constants/ui_keys'
import { UI_MODAL_KEYS } from '../../constants/modals'
import { getDMSSetting } from '../../selectors/ui'

function* onBadInternetConnection({ payload: { isBadConnection } }) {
  yield put(UIActions.setUIValue(UI_KEYS.isBadInternetConnection, isBadConnection))
  const dms = yield select(getDMSSetting)

  if (dms) {
    yield put(UIActions.changeUIModalState(UI_MODAL_KEYS.BAD_INTERNET_CONNECTION_MODAL, isBadConnection))
  }
}

export default onBadInternetConnection
