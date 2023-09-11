import { put, select } from 'redux-saga/effects'
import { getAuthToken } from '../../selectors/ws'
import WSActions from '../../actions/ws'

export default function* cancelAlgoOrder({ payload: { gid } }) {
  const authToken = yield select(getAuthToken)
  yield put(WSActions.send(['algo_order.cancel', authToken, 'bitfinex', gid]))
}
