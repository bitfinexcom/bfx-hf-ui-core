import { put, select } from 'redux-saga/effects'
import _forEach from 'lodash/forEach'

import { getMarketPair } from '../../selectors/meta'
import WSActions from '../../actions/ws'

export default function* ({ payload }) {
  const { orderHist = [] } = payload
  const getMarketPairState = yield select(getMarketPair)

  const transformed = {}
  _forEach(orderHist, o => {
    transformed[o?.id] = {
      ...o,
      originalAmount: o.amountOrig,
      priceAverage: o.priceAvg,
      created: o.mtsUpdate,
      pair: getMarketPairState(o.symbol),
    }
  })

  yield put(WSActions.setOrderHist(transformed))
}
