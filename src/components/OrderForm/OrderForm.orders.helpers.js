import {
  Iceberg,
  TWAP,
  AccumulateDistribute,
  PingPong,
  Bracket,
  Recurring,
} from 'bfx-hf-algo'
import memoizeOne from 'memoize-one'
import _values from 'lodash/values'
import _map from 'lodash/map'
import _filter from 'lodash/filter'
import { isElectronApp } from '../../redux/config'
import timeFrames from '../../util/time_frames'

import rawOrders from '../../orders'

const getAlgoOrdersForStandalone = (isPaperTrading) => {
  const aos = [
    AccumulateDistribute,
    PingPong,
    Iceberg,
    TWAP,
    Bracket,
  ]
  if (!isPaperTrading) {
    aos.unshift(Recurring)
  }

  return aos
}

const HOSTED_ALGO_ORDERS = [Iceberg, TWAP]

const getAlgoOrders = (isPaperTrading) => (isElectronApp ? getAlgoOrdersForStandalone(isPaperTrading) : HOSTED_ALGO_ORDERS)

export const getAOs = memoizeOne(({ t, isEditMode, isPaperTrading = false }) => _map(getAlgoOrders(isPaperTrading), (ao) => ao.meta.getUIDef({
  timeframes: timeFrames,
  i18n: { t, prefix: 'algoOrderForm.' },
  isEditMode,
}),
),
)

export const getAtomicOrders = memoizeOne((t) => _map(_values(rawOrders), (uiDef) => uiDef(t)))

export const filterAOs = (aos, market) => {
  const { isPerp } = market
  let processedAOs = aos

  if (isPerp) {
    processedAOs = _filter(aos, (ao) => ao.id !== Recurring.id)
  }

  return processedAOs
}

export const validateOrderLimits = (
  orderCount,
  pair,
  existingOrders,
  maxOrders,
) => {
  const errors = {}
  const newOrderCountTotal = orderCount + existingOrders?.total
  const newOrderCountPair = orderCount + existingOrders?.pair

  const totalLimitExceeds = newOrderCountTotal > maxOrders?.total
  const pairLimitExceeds = newOrderCountPair > maxOrders?.pair

  if (totalLimitExceeds || pairLimitExceeds) {
    errors.field = 'orderCount'
    errors.i18n = {
      key: totalLimitExceeds
        ? 'orderCountExceedsTotalMaxLimit'
        : 'orderCountExceedsPairMaxLimit',
      props: {
        count: totalLimitExceeds ? newOrderCountTotal : newOrderCountPair,
        limit: totalLimitExceeds ? maxOrders?.total : maxOrders?.pair,
        pair,
      },
    }
  }

  return errors
}
