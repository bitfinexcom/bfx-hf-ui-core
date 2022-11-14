import {
  actionChannel, call, put, select, take,
} from 'redux-saga/effects'
import { v4 } from 'uuid'
import _isEmpty from 'lodash/isEmpty'
import { eventChannel } from 'redux-saga'
import WSActions from '../../actions/ws'
import i18n from '../../../locales/i18n'
import { MAIN_MODE } from '../../reducers/ui'
import t from '../../constants/ws'
import { getAuthToken } from '../../selectors/ws'

const ipcHelpers = window.electronService

const waitForSaveStrategiesResult = () => eventChannel((emitter) => {
  ipcHelpers.addSaveAllStrategiesResultListner((_, payload) => emitter(payload),
  )

  return ipcHelpers.removeSaveAllStrategiesResultListener
})

function* saveStrategiesToZIP(strategies) {
  if (_isEmpty(strategies)) {
    yield put(
      WSActions.recvNotification({
        mts: Date.now(),
        status: 'info',
        text: i18n.t('resetDataConfirmModal.emptyList'),
        cid: v4(),
      }),
    )
    yield put(WSActions.authResetData())
    return
  }

  if (!ipcHelpers) {
    return
  }

  // try to save strategies using electron main process and wait for result
  ipcHelpers.sendSaveAllStrategiesEvent(strategies)
  const electronChannel = yield call(waitForSaveStrategiesResult)
  while (true) {
    const { isSuccess } = yield take(electronChannel)
    electronChannel.close()

    if (isSuccess) {
      yield put(WSActions.authResetData())
    } else {
      yield put(
        WSActions.recvNotification({
          mts: Date.now(),
          status: 'error',
          text: i18n.t('resetDataConfirmModal.errorOnStrategiesSave'),
          cid: v4(),
        }),
      )
    }
  }
}

export default function* ({ payload }) {
  const { password } = payload

  // pass password and wait for strategies
  yield put(
    WSActions.send(['get.saved_decrypted_strategies', password, MAIN_MODE]),
  )

  const requestChannel = yield actionChannel(t.DATA_STRATEGIES)
  while (true) {
    const {
      payload: { strategies },
    } = yield take(requestChannel)
    const authToken = yield select(getAuthToken)

    if (!authToken) {
      // save strategies only if the user has not logged in yet
      yield call(saveStrategiesToZIP, strategies)
    }

    yield requestChannel.close()
  }
}
