import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import { getAuthToken } from '../../selectors/ws'

export default function* saveAlgoOrderParams({ payload }) {
  const { data } = payload
  const authToken = yield select(getAuthToken)
  if (!authToken) {
    return
  }

  const { algoID, symbol } = data

  yield put(WSActions.send(['algo_order_params.save', authToken, data]))
  yield put(AOActions.appendAlgoOrderParams(algoID, symbol, data))
}
