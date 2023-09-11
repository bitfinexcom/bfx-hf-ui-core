import {
  call, delay, put, select, take,
} from 'redux-saga/effects'
import Debug from 'debug'
import WSActions from '../../actions/ws'
import types from '../../constants/ao'
import { getAuthToken } from '../../selectors/ws'
import handleRecurringAoAtomics from './handle_recurring_ao_atomics'
import AOActions from '../../actions/ao'
import { RECURRING_DELAY_FOR_FETCH } from '../../helpers/recurring_ao'

const debug = Debug('hfui:recurring-ao')

export default function* fetchRecurringAoAtomics({
  payload: { gid, firstDataRequest },
}) {
  const authToken = yield select(getAuthToken)

  yield put(
    WSActions.send(['recurring_algo_order.orders', authToken, 'bitfinex', gid]),
  )
  debug('request atomics for recurring %s', gid)

  while (true) {
    const action = yield take([
      types.DATA_RECURRING_AO_ATOMICS,
      types.GET_RECURRING_AO_ATOMICS_FAILED,
    ])
    const {
      payload: { orders, gid: _gid, mode },
      type,
    } = action

    if (gid === _gid) {
      if (type === types.GET_RECURRING_AO_ATOMICS_FAILED) {
        debug('FAILED request atomics for recurring %s, retry in 1.5s', gid)
        yield delay(RECURRING_DELAY_FOR_FETCH)
        yield put(
          AOActions.requestRecurringAoAtomics({ gid, firstDataRequest }),
        )
        break
      }
      yield call(handleRecurringAoAtomics, {
        gid,
        orders,
        firstDataRequest,
        mode,
      })
      break
    }
  }
}
