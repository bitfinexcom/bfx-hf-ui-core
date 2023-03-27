import { put } from 'redux-saga/effects'

import UIActions from '../../actions/ui'
import { LOG_LEVELS } from '../../../constants/logging'

export default function* () {
  yield put(UIActions.logInformation(null, LOG_LEVELS.DEBUG, 'layout_created'))
}
