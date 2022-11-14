import {
  delay, put, select, call,
} from 'redux-saga/effects'
import _isEmpty from 'lodash/isEmpty'

import WSActions from '../../actions/ws'
import getSettings from '../../selectors/ui/get_settings'
import { getAuthToken } from '../../selectors/ws'
import { getScope } from '../../../util/scope'

export default function* onSaveSettings(action = {}) {
  const { payload = {} } = action
  const { key, value } = payload

  function* sendWSMessage() {
    const authToken = yield select(getAuthToken)
    const settings = { ...(yield select(getSettings)) }

    // Save updated settings after login
    if (!authToken || _isEmpty(settings)) {
      yield delay(3000)
      yield call(sendWSMessage)
      return
    }

    settings[key] = value

    yield put(
      WSActions.send([
        'settings.update',
        authToken,
        { ...settings },
        getScope(),
      ]),
    )
  }

  yield call(sendWSMessage)
}
