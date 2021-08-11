import { takeEvery } from 'redux-saga/effects'
import types from '../../constants/market'
import getCcyFullNames from './get_ccy_full_names'
import getPerpsNames from './get_perps_names'

export default function* () {
  yield takeEvery(types.GET_CCY_FULL_NAMES, getCcyFullNames)
  yield takeEvery(types.GET_PERPS_NAMES, getPerpsNames)
}
