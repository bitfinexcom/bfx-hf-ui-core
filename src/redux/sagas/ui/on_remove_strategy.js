import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import { UI_KEYS } from '../../constants/ui_keys'
import { getStrategyId } from '../../selectors/ui'

export default function* ({ payload }) {
  const { authToken, id } = payload

  const currentStrategyId = yield select(getStrategyId)

  yield put(WSActions.send(['strategy.remove', authToken, id]))
  if (currentStrategyId === id) {
    yield put(WSActions.resetBacktestData())
    yield put(UIActions.setUIValue(UI_KEYS.currentStrategy, {}))
  }
}
