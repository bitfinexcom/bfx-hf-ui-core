import { put } from 'redux-saga/effects'
import UIActions from '../../actions/ui'
import WSActions from '../../actions/ws'
import { LOG_LEVELS } from '../../../constants/logging'

const SWITCHED_TO_SANDBOX_MSG = 'Switched to sandbox mode'
const SWITCHED_TO_LIVE_MSG = 'Switched to live trading mode'

export default function* onChangeMode(action) {
  const { payload: { isPaperTrading } } = action

  const msg = isPaperTrading ? SWITCHED_TO_SANDBOX_MSG : SWITCHED_TO_LIVE_MSG
  yield put(UIActions.logInformation(msg, LOG_LEVELS.INFO, 'change_env'))

  yield put(UIActions.setTradingMode(isPaperTrading))
  yield put(UIActions.setPendoState(false))
  yield put(WSActions.setUsername(null))
  yield put(UIActions.setMarketFromStore(isPaperTrading))
  yield put(WSActions.recvBalances({ balances: [] }))
  yield put(WSActions.recvPositions({ positions: [] }))
  yield put(WSActions.recvOrders({ orders: [] }))
  yield put(WSActions.changeMode(isPaperTrading))
}
