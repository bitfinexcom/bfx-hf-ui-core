import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import { getAuthToken } from '../../selectors/ws'
import { getIsActiveAlgoOrdersAfterLogin } from '../../selectors/ao'

export default function* handleActiveAlgoOrders({ payload: _payload }) {
  const {
    type,
    allOrders,
    selectedOrders,
    unselectedOrders,
  } = _payload
  const authToken = yield select(getAuthToken)
  const isAfterLogin = yield select(getIsActiveAlgoOrdersAfterLogin)

  if (isAfterLogin) {
    if (type === 'resume') {
      yield put(
        WSActions.send(['algo_order.remove', authToken, unselectedOrders]),
      )
      yield put(WSActions.send(['algo_order.load', authToken, selectedOrders]))
    }
    if (type === 'cancel_all') {
      yield put(WSActions.send(['algo_order.remove', authToken, allOrders]))
    }
  } else {
    const payload = {
      resume: [],
      remove: [],
    }
    if (type === 'resume') {
      payload.resume = [...selectedOrders]
      payload.remove = [...unselectedOrders]
    }
    if (type === 'cancel_all') {
      payload.remove = [...allOrders]
    }
    yield put(
      WSActions.send(['algo_order.selected_resume_remove', authToken, payload]),
    )
  }

  yield put(AOActions.setActiveAlgoOrders([], true))
  yield put(AOActions.showActiveOrdersModal(false))
}
