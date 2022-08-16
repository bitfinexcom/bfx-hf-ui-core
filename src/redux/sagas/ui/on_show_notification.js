/* eslint-disable no-unused-vars */
import { select } from 'redux-saga/effects'
import { UI_KEYS } from '../../constants/ui_keys'
import { getUIState } from '../../selectors/ui'

const ipcHelpers = window.electronService

const restoreApplication = () => ipcHelpers.sendRestoreAppMessage()

export default function* onShowNotification(action = {}) {
  const isApplicationHidden = yield select((state) => getUIState(state, UI_KEYS.isApplicationHidden))

  if (!isApplicationHidden) {
    return
  }

  const { payload: { notification: { text } } } = action

  const nativeNotification = new Notification('Bitfinex Honey', { body: text, icon: '/HF-icon.png' })
  nativeNotification.addEventListener('click', restoreApplication)

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      nativeNotification.close()
    }
  })
}
