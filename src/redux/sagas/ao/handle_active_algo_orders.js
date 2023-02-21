import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import { getAuthToken } from '../../selectors/ws'

export default function* handleActiveAlgoOrders({ payload: _payload }) {
  const {
    type,
    allOrders,
    selectedOrders,
    unselectedOrders,
  } = _payload
  const authToken = yield select(getAuthToken)

  const payload = {
    main: {},
    paper: {},
  }

  if (type === 'resume') {
    payload.main.resume = [...selectedOrders.main]
    payload.paper.resume = [...selectedOrders.paper]

    payload.main.remove = [...unselectedOrders.main]
    payload.paper.remove = [...unselectedOrders.paper]
  }
  if (type === 'cancel_all') {
    payload.main.remove = [...allOrders.main]
    payload.paper.remove = [...allOrders.paper]
  }
  yield put(
    WSActions.send(['algo_order.selected_resume_remove', authToken, payload]),
  )

  yield put(AOActions.setActiveAlgoOrders({ main: [], paper: [] }, true))
  yield put(AOActions.showActiveOrdersModal(false))
}
