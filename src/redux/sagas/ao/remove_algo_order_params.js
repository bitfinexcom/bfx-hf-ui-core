import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import { getAuthToken } from '../../selectors/ws'

export default function* removeAlgoOrderParams({ payload }) {
  const { id } = payload
  const authToken = yield select(getAuthToken)
  if (!authToken) {
    return
  }

  yield put(WSActions.send(['algo_order_params.remove', authToken, id]))
}
