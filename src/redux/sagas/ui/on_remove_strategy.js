import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import { getCurrentStrategy } from '../../selectors/ui'

export default function* ({ payload }) {
  const { authToken, id } = payload

  const { id: currentStrategyId } = yield select(getCurrentStrategy)

  yield put(WSActions.send(['strategy.remove', authToken, id]))
  if (currentStrategyId === id) {
    yield put(WSActions.resetBacktestData())
    yield put(UIActions.setCurrentStrategy({}))
  }
}
