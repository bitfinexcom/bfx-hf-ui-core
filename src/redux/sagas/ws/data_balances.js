import { select, put } from 'redux-saga/effects'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import _forEach from 'lodash/forEach'

import { balanceAdapter } from '../../adapters/ws'
import WSActions from '../../actions/ws'
import { getKey } from '../../reducers/ws/balances'

const { getCurrencySymbolMemo } = reduxSelectors

export default function* ({ payload }) {
  const getCurrencySymbol = yield select(getCurrencySymbolMemo)
  const { balances = [] } = payload

  const transformed = {}
  _forEach(balances, balance => {
    const adapted = balanceAdapter(balance, getCurrencySymbol)
    transformed[getKey(adapted)] = adapted
  })

  yield put(WSActions.setBalances(transformed))
}
