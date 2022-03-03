import Limit from './limit'
import Market from './market'
import Stop from './stop'
import StopLimit from './stop_limit'
import TrailingStop from './trailing_stop'
import FillOrKill from './fok'
import ImmediateOrCancel from './ioc'

export const isLimit = (type, t) => type === Limit(t)?.id

export const isStop = (type, t) => type === Stop(t)?.id

export const isStopLimit = (type, t) => type === StopLimit(t)?.id

export const isTrailingStop = (type, t) => type === TrailingStop(t)?.id

// In Bitfinex dropdown order
export default {
  Limit,
  Market,
  Stop,
  StopLimit,
  TrailingStop,
  FillOrKill,
  ImmediateOrCancel,
}
