import {
  call, delay, put, select,
} from 'redux-saga/effects'
import _forEach from 'lodash/forEach'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import { v4 } from 'uuid'
import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import UIActions from '../../actions/ui'
import { getAlgoOrderById, getOrderHistory } from '../../selectors/ws'
import { getFailedRecurringAoAtomics } from '../../selectors/ao'
import { getMarketPair } from '../../selectors/meta'
import scheduleFetchingRecurringAOStatus from './schedule_fetching_recurring_ao_status'
import TIMEFRAME_WIDTHS from '../../../util/time_frame_widths'
import fetchRecurringAoAtomics from './fetch_recurring_ao_atomics'
import { getCurrentMode, getFormatTimeFn } from '../../selectors/ui'
import { getLastSessionTimestamp } from '../../../util/ui'
import i18n from '../../../locales/i18n'

const FAILED_ORDER_STATUS = 'FAILED'

export default function* handleRecurringAoAtomics({
  mode,
  gid,
  orders,
  firstDataRequest,
}) {
  const failedOrders = yield select(getFailedRecurringAoAtomics)
  const placedOrders = yield select(getOrderHistory)
  const getMarketPairState = yield select(getMarketPair)
  const currentMode = yield select(getCurrentMode)
  const formatTime = yield select(getFormatTimeFn)

  const recurringAO = yield select(getAlgoOrderById(gid))
  const {
    args: { startedAt, endedAt, recurrence },
    alias,
  } = recurringAO

  const lastSessionTime = getLastSessionTimestamp()

  const newFailedOrders = {}
  const newPlacedOrders = {}
  const notifications = []

  _forEach(orders, (o) => {
    const {
      id = o._id, status, createdAt, orderSubmitError,
    } = o
    const isOrderFailed = status === FAILED_ORDER_STATUS

    const isOrderNew = new Date(createdAt).getTime() > lastSessionTime

    if (isOrderNew) {
      const time = formatTime(createdAt)
      let notification = null
      if (isOrderFailed) {
        notification = {
          mts: Date.now(),
          status: 'error',
          text: i18n.t('notifications.recurringAoFailed', {
            alias,
            time,
            reason: `${status}: ${orderSubmitError}`,
          }),
          cid: v4(),
        }
      } else {
        notification = {
          mts: Date.now(),
          status: 'success',
          text: i18n.t('notifications.recurringAoExecutedSuccessfully', {
            alias,
            time,
          }),
          cid: v4(),
        }
      }
      notifications.push(notification)
    }

    if (isOrderFailed) {
      const isExist = _get(failedOrders, id, null)
      if (isExist) {
        return
      }
      newFailedOrders[id] = {
        ...o,
        id,
        originalAmount: o.amount,
        created: new Date(createdAt).getTime(),
        mtsUpdate: new Date(createdAt).getTime(),
        pair: getMarketPairState(o.symbol),
        price: 0,
      }
    } else {
      const isExist = _get(placedOrders, id, null)
      if (isExist) {
        return
      }
      newPlacedOrders[id] = {
        ...o,
        originalAmount: o.amountOrig,
        priceAverage: o.priceAvg,
        created: o.mtsUpdate,
        pair: getMarketPairState(o.symbol),
      }
    }
  })

  let isResponseUseful = false

  if (!_isEmpty(newFailedOrders)) {
    yield put(AOActions.setFailedRecurringAoAtomics(newFailedOrders))
    isResponseUseful = true
  }

  if (!_isEmpty(newPlacedOrders)) {
    if (currentMode === mode) {
      yield put(WSActions.setOrderHist(newPlacedOrders))
    }
    isResponseUseful = true
  }
  if (!_isEmpty(notifications)) {
    yield put(UIActions.setNotifications(notifications))
  }

  if (isResponseUseful || firstDataRequest) {
    yield call(scheduleFetchingRecurringAOStatus, {
      gid,
      startedAt,
      endedAt,
      recurrence,
    })
  } else {
    yield delay(TIMEFRAME_WIDTHS['1m'])
    yield call(fetchRecurringAoAtomics, { gid, firstDataRequest: false })
  }
}
