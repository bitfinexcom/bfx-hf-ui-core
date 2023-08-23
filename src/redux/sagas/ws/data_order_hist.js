import { put, select } from 'redux-saga/effects'
import _forEach from 'lodash/forEach'

import { getMarketPair } from '../../selectors/meta'
import WSActions from '../../actions/ws'

const FAILED_ORDER_STATUS = 'FAILED'

export default function* ({ payload }) {
  const { orderHist = [] } = payload
  const getMarketPairState = yield select(getMarketPair)

  const transformed = {
    placed: {},
    failed: {},
  }
  _forEach(orderHist, o => {
    const { status } = o
    if (status === FAILED_ORDER_STATUS) {
      transformed.failed[o?._id] = {
        ...o,
        originalAmount: o.amount,
        created: new Date(o.createdAt).getTime(),
        pair: getMarketPairState(o.symbol),
        price: 0,
      }
      return
    }
    transformed.placed[o?.id] = {
      ...o,
      originalAmount: o.amountOrig,
      priceAverage: o.priceAvg,
      created: o.mtsUpdate,
      pair: getMarketPairState(o.symbol),
    }
  })
  yield put(WSActions.setOrderHist(transformed))
}
