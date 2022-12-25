import { select, put } from 'redux-saga/effects'
import _get from 'lodash/get'
import Debug from 'debug'
import { getCurrentModeAlgoOrders } from '../../selectors/ws'
import WSActions from '../../actions/ws'
import { getCurrentMode } from '../../selectors/ui'

const debug = Debug('hfui:ao-stopped')

export default function* onAlgoOrderStopped({ payload }) {
  const { gid } = payload

  const aos = yield select(getCurrentModeAlgoOrders)
  const stoppedAO = _get(aos, gid, null)

  const currentMode = yield select(getCurrentMode)

  if (!stoppedAO) {
    debug('ao is not found', gid)
    return
  }

  yield put(WSActions.setAlgoOrderToHistory(stoppedAO, currentMode))
  yield put(WSActions.removeAlgoOrder(gid, currentMode))

  debug('ao was successfully moved to the history', gid)
}
