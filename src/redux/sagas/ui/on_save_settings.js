import {
  delay, put, select, call,
} from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import getSettings, { SETTINGS_KEYS } from '../../selectors/ui/get_settings'
import { getAuthToken } from '../../selectors/ws'
import { getScope } from '../../../util/scope'

const {
  DMS,
  SHOW_ALGO_PAUSE_INFO,
  SHOW_ONLY_FAVORITE_PAIRS,
  THEME,
  JOIN_BETA_PROGRAM,
  HIDE_ON_CLOSE,
  FULLSCREEN,
} = SETTINGS_KEYS

export default function* onSaveSettings(action = {}) {
  const { payload = {} } = action
  const { key, value } = payload

  function* sendWSMessage() {
    const authToken = yield select(getAuthToken)

    // Save updated settings after login
    if (!authToken) {
      yield delay(3000)
      yield call(sendWSMessage)
      return
    }
    const settings = { ...(yield select(getSettings)) }
    settings[key] = value

    yield put(
      WSActions.send([
        'settings.update',
        authToken,
        settings[DMS],
        settings[SHOW_ALGO_PAUSE_INFO],
        settings[SHOW_ONLY_FAVORITE_PAIRS],
        false, // @TODO: remove this setting on the backend side
        settings[THEME],
        settings[JOIN_BETA_PROGRAM],
        settings[HIDE_ON_CLOSE],
        settings[FULLSCREEN],
        getScope(),
      ]),
    )
  }

  yield call(sendWSMessage)
}
