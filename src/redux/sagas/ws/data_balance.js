import { select, put } from 'redux-saga/effects'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import { balanceAdapter } from '../../adapters/ws'
import WSActions from '../../actions/ws'

const { getCurrencySymbolMemo } = reduxSelectors

export default function* ({ payload }) {
  const getCurrencySymbol = yield select(getCurrencySymbolMemo)
  const { balance = [] } = payload
  const adapted = balanceAdapter(balance, getCurrencySymbol)

  yield put(WSActions.setBalance(adapted))
}
