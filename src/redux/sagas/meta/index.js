import { takeEvery } from 'redux-saga/effects'
import types from '../../constants/market'
import getCcyFullNames from './get_ccy_full_names'
import getPerpsNames from './get_perps_names'
import getCcysId from './get_ccys_id'

export default function* () {
  yield takeEvery(types.GET_CCY_FULL_NAMES, getCcyFullNames)
  yield takeEvery(types.GET_PERPS_NAMES, getPerpsNames)
  yield takeEvery(types.GET_CCYS_ID, getCcysId)
}
