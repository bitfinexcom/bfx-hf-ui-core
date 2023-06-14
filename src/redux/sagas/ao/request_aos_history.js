import { put, select } from 'redux-saga/effects'
import { getAuthToken } from '../../selectors/ws'
import WSActions from '../../actions/ws'

export default function* requestAOsHistory({ payload }) {
  const { showAOsHistory } = payload

  if (!showAOsHistory) {
    return
  }
  const authToken = yield select(getAuthToken)

  yield put(WSActions.send(['algo_order.history', authToken]))
}
