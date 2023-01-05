import { put, select } from 'redux-saga/effects'
import { getAuthToken, getIsAOsHistoryLoaded } from '../../selectors/ws'
import WSActions from '../../actions/ws'

export default function* requestAOsHistory({ payload }) {
  const { showAOsHistory } = payload
  const isHistoryLoaded = yield select(getIsAOsHistoryLoaded)

  if (!showAOsHistory || isHistoryLoaded) {
    return
  }
  const authToken = yield select(getAuthToken)

  yield put(WSActions.send(['algo_order.history', authToken]))
}
