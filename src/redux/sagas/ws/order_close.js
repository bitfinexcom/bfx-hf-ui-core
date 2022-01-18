import { put, select } from 'redux-saga/effects'
import { getMarketPair } from '../../selectors/meta'
import { orderAdapter } from '../../adapters/ws'
import WSActions from '../../actions/ws'

export default function* ({ payload: { order } }) {
  const getMarketPairState = yield select(getMarketPair)
  const o = orderAdapter(order, getMarketPairState)
  yield put(WSActions.setOrderClose({
    order: o,
  }))
}
