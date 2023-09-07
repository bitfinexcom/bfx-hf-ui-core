import {
  call, put, select, take,
} from 'redux-saga/effects'
import WSActions from '../../actions/ws'
import types from '../../constants/ao'
import { getAuthToken } from '../../selectors/ws'
import handleRecurringAoAtomics from './handle_recurring_ao_atomics'

export default function* fetchRecurringAoAtomics({ gid, firstDataRequest }) {
  const authToken = yield select(getAuthToken)

  yield put(WSActions.send(['recurring_algo_order.orders', authToken, 'bitfinex', gid]))

  while (true) {
    const action = yield take(types.DATA_RECURRING_AO_ATOMICS)
    const { payload: { orders, gid: _gid, mode } } = action
    if (gid === _gid) {
      yield call(handleRecurringAoAtomics, {
        gid, orders, firstDataRequest, mode,
      })
      break
    }
  }
}
