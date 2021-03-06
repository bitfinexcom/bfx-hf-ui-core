import { fork } from 'redux-saga/effects'
import { reduxSagas } from '@ufx-ui/bfx-containers'

import WSSaga from './ws'
import UISaga from './ui'
import AOSaga from './ao'
import metaSaga from './meta'
import zendesk from './zendesk'

export default function* rootSaga() {
  yield fork(WSSaga)
  yield fork(UISaga)
  yield fork(AOSaga)
  yield fork(metaSaga)
  yield fork(zendesk)
  yield fork(reduxSagas.wsSaga)
  yield fork(reduxSagas.tickersSaga)
  yield fork(reduxSagas.currenciesSaga)
}
