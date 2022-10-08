import { put } from 'redux-saga/effects'
import { removeStoredPassword, updateAutoLoginState } from '../../../util/autologin'
import { IS_PAPER_TRADING } from '../../reducers/ui'
import WSActions from '../../actions/ws'

export default function* () {
  removeStoredPassword()
  updateAutoLoginState()
  yield put(WSActions.send(['auth.reset']))
  window.localStorage.setItem(IS_PAPER_TRADING, false)
}
