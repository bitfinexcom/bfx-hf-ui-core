import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import { getAuthToken } from '../../selectors/ws'

export default function* handleActiveAlgoOrders({ payload }) {
  const {
    type,
    allOrders,
    selectedOrders,
    unselectedOrders,
  } = payload
  const authToken = yield select(getAuthToken)
  if (type === 'resume') {
    yield put(WSActions.send(['algo_order.remove', authToken, unselectedOrders]))
    yield put(WSActions.send(['algo_order.load', authToken, selectedOrders]))
  }
  if (type === 'cancel_all') {
    yield put(WSActions.send(['algo_order.remove', authToken, allOrders]))
  }
  yield put(AOActions.setActiveAlgoOrders([]))
  yield put(AOActions.showActiveOrdersModal(false))
}
