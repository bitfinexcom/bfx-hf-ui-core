import {
  Iceberg, TWAP, AccumulateDistribute, PingPong, MACrossover, OCOCO,
} from 'bfx-hf-algo'
import memoizeOne from 'memoize-one'
import _values from 'lodash/values'
import _map from 'lodash/map'

import { isElectronApp, showInDevelopmentModules } from '../../redux/config'
import timeFrames from '../../util/time_frames'

import rawOrders from '../../orders'

const DEV_ONLY_ALGO_ORDERS = [
  MACrossover,
  AccumulateDistribute,
]

const ALL_ALGO_ORDERS = [
  ...(showInDevelopmentModules ? DEV_ONLY_ALGO_ORDERS : []),
  PingPong,
  Iceberg,
  TWAP,
  OCOCO,
]

const HOSTED_ALGO_ORDERS = [Iceberg, TWAP]

const algoOrders = isElectronApp ? ALL_ALGO_ORDERS : HOSTED_ALGO_ORDERS

export const getAOs = memoizeOne((t) => _map(algoOrders, ao => ao.meta.getUIDef({
  timeframes: timeFrames,
  i18n: { t, prefix: 'algoOrderForm.' },
})))

export const getAtomicOrders = memoizeOne((t) => _map(_values(rawOrders), uiDef => uiDef(t)))

export const validateOrderLimits = (orderCount, pair, existingOrders, maxOrders) => {
  const errors = {}
  const newOrderCountTotal = orderCount + existingOrders?.total
  const newOrderCountPair = orderCount + existingOrders?.pair

  const totalLimitExceeds = newOrderCountTotal > maxOrders?.total
  const pairLimitExceeds = newOrderCountPair > maxOrders?.pair

  if (totalLimitExceeds || pairLimitExceeds) {
    errors.field = 'orderCount'
    errors.i18n = {
      key: totalLimitExceeds ? 'orderCountExceedsTotalMaxLimit' : 'orderCountExceedsPairMaxLimit',
      props: {
        count: totalLimitExceeds ? newOrderCountTotal : newOrderCountPair,
        limit: totalLimitExceeds ? maxOrders?.total : maxOrders?.pair,
        pair,
      },
    }
  }

  return errors
}
