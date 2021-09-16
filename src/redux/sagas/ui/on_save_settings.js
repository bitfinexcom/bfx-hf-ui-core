import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import getSettings from '../../selectors/ui/get_settings'
import { getAuthToken } from '../../selectors/ws'

export default function* onSaveSettings(action = {}) {
  const { payload = {} } = action
  const { key, value } = payload
  const authToken = yield select(getAuthToken)
  const settings = { ...yield select(getSettings) }
  settings[key] = value

  yield put(WSActions.send([
    'settings.update',
    authToken,
    settings.dms,
    settings.ga,
    settings.showAlgoPauseInfo,
    settings.showOnlyFavoritePairs,
    settings.rebootAutomatically,
  ]))
}
