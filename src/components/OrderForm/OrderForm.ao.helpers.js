import {
  Iceberg, TWAP, AccumulateDistribute, PingPong, MACrossover, OCOCO,
} from 'bfx-hf-algo'
import memoizeOne from 'memoize-one'

import { isElectronApp } from '../../redux/config'
import timeFrames from '../../util/time_frames'

const ALL_ALGO_ORDERS = [
  MACrossover,
  AccumulateDistribute,
  PingPong,
  Iceberg,
  TWAP,
  OCOCO,
]

const HOSTED_ALGO_ORDERS = [Iceberg, TWAP]

const algoOrders = isElectronApp ? ALL_ALGO_ORDERS : HOSTED_ALGO_ORDERS

export const getAOs = memoizeOne((t) => algoOrders.map(ao => ao.meta.getUIDef({
  timeframes: timeFrames,
  i18n: { t, prefix: 'algoOrderForm.' },
})))
