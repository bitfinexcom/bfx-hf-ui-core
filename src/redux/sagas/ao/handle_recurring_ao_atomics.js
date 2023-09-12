import {
  call, delay, put, select,
} from 'redux-saga/effects'
import _forEach from 'lodash/forEach'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import _includes from 'lodash/includes'
import Debug from 'debug'
import { v4 } from 'uuid'
import WSActions from '../../actions/ws'
import AOActions from '../../actions/ao'
import UIActions from '../../actions/ui'
import { getAlgoOrderById, getOrderHistory } from '../../selectors/ws'
import { getFailedRecurringAoAtomics } from '../../selectors/ao'
import { getMarketPair } from '../../selectors/meta'
import scheduleRecurringAo from './schedule_recurring_ao'
import TIMEFRAME_WIDTHS from '../../../util/time_frame_widths'
import { getCurrentMode, getFormatTimeFn } from '../../selectors/ui'
import { getRecurringAtomicsShownNotifications, setRecurringAtomicsShownNotifications } from '../../../util/ui'
import i18n from '../../../locales/i18n'

const FAILED_ORDER_STATUS = 'FAILED'
const debug = Debug('hfui:recurring-ao')

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

  const previouslyShownNotifications = getRecurringAtomicsShownNotifications()
  console.log(previouslyShownNotifications)

  const newFailedOrders = {}
  const newPlacedOrders = {}
  const notifications = []
  const recentlyShownNotifications = []

  _forEach(orders, (o, index, arr) => {
    const {
      id = o._id, status, createdAt, orderSubmitError,
    } = o
    const isOrderFailed = status === FAILED_ORDER_STATUS

    let shouldBeShownInNotifications

    // show only the latest orders if there is no local data to avoid spam
    if (_isEmpty(previouslyShownNotifications)) {
      shouldBeShownInNotifications = arr.length === index + 1
      recentlyShownNotifications.push(id)
    } else {
      shouldBeShownInNotifications = !_includes(previouslyShownNotifications, id)
      if (shouldBeShownInNotifications) {
        recentlyShownNotifications.push(id)
      }
    }

    if (shouldBeShownInNotifications) {
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
    setRecurringAtomicsShownNotifications(recentlyShownNotifications)
  }

  debug('received atomics for %s', gid, {
    newFailedOrders,
    newPlacedOrders,
    notifications,
    isResponseUseful,
    firstDataRequest,
  })

  if (isResponseUseful || firstDataRequest) {
    yield call(scheduleRecurringAo, {
      gid,
      startedAt,
      endedAt,
      recurrence,
    })
  } else {
    debug('there are not new orders for %s, fetch again in 1m', gid)
    yield delay(TIMEFRAME_WIDTHS['1m'])
    yield put(AOActions.requestRecurringAoAtomics({ gid, firstDataRequest: false }))
  }
}
