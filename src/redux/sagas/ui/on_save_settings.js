import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import getSettings from '../../selectors/ui/get_settings'

export default function* onSaveSettings(action = {}) {
  const { payload = {} } = action
  const { key, value } = payload
  const settings = { ...yield select(getSettings) }
  settings[key] = value

  yield put(WSActions.send([
    'settings.save',
    {
      dms: settings.dms,
      ga: settings.ga,
      showAlgoPauseInfo: settings.showAlgoPauseInfo,
      showOnlyFavoritePairs: settings.showOnlyFavoritePairs,
    },
    // settings,
  ]))
}
