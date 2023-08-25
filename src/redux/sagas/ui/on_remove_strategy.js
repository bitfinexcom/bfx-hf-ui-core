import { put, select } from 'redux-saga/effects'

import WSActions from '../../actions/ws'
import UIActions from '../../actions/ui'
import WSTypes from '../../constants/ws'
import { getCurrentStrategy } from '../../selectors/ui'
import { PAPER_MODE } from '../../reducers/ui'
import { LOG_LEVELS } from '../../../constants/logging'

export default function* ({ payload }) {
  const { authToken, id } = payload

  const { id: currentStrategyId } = yield select(getCurrentStrategy)

  yield put(WSActions.send(['strategy.remove', authToken, id]))
  yield put(
    WSActions.send({
      alias: WSTypes.ALIAS_DATA_SERVER,
      data: ['delete.bt.history.all', id],
    }),
  )
  yield put(
    UIActions.logInformation(
      `Deleted strategy draft (${id})`,
      LOG_LEVELS.INFO,
      'strategy_draft_removed',
    ),
  )
  if (currentStrategyId === id) {
    yield put(WSActions.purgeBacktestData())
    yield put(UIActions.setCurrentStrategy({}, PAPER_MODE))
  }
}
