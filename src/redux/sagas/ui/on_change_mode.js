import { put } from 'redux-saga/effects'
import UIActions from '../../actions/ui'
import WSActions from '../../actions/ws'

export default function* onChangeMode(action) {
  const { payload: { isPaperTrading } } = action

  yield put(UIActions.setTradingMode(isPaperTrading))
  yield put(UIActions.setMarketFromStore(isPaperTrading))
  yield put(WSActions.recvBalances({ balances: [] }))
  yield put(WSActions.recvPositions({ positions: [] }))
  yield put(WSActions.recvOrders({ orders: [] }))
  yield put(WSActions.changeMode(isPaperTrading))
}
