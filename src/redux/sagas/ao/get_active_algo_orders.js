import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import { getAuthToken } from '../../selectors/ws'
import { getCurrentMode } from '../../selectors/ui'

export default function* getActiveAlgoOrders({ payload: { initialFetch } }) {
  const authToken = yield select(getAuthToken)
  if (!authToken) {
    return
  }
  const mode = yield select(getCurrentMode)
  yield put(WSActions.send(['get.active_algo_orders', authToken, mode, initialFetch]))
}
