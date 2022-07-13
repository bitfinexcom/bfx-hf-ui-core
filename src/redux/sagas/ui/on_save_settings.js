import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import getSettings, { SETTINGS_KEYS } from '../../selectors/ui/get_settings'
import { getAuthToken } from '../../selectors/ws'

const {
  DMS,
  SHOW_ALGO_PAUSE_INFO,
  SHOW_ONLY_FAVORITE_PAIRS,
  REBOOT_AUTOMATICALLY,
  THEME,
  JOIN_BETA_PROGRAM,
} = SETTINGS_KEYS

export default function* onSaveSettings(action = {}) {
  const { payload = {} } = action
  const { key, value } = payload
  const authToken = yield select(getAuthToken)
  const settings = { ...(yield select(getSettings)) }
  settings[key] = value

  yield put(
    WSActions.send([
      'settings.update',
      authToken,
      settings[DMS],
      settings[SHOW_ALGO_PAUSE_INFO],
      settings[SHOW_ONLY_FAVORITE_PAIRS],
      settings[REBOOT_AUTOMATICALLY],
      settings[THEME],
      settings[JOIN_BETA_PROGRAM],
    ]),
  )
}
