import _toString from 'lodash/toString'
import _keys from 'lodash/keys'
import _includes from 'lodash/includes'
import _reduce from 'lodash/reduce'
import _toNumber from 'lodash/toNumber'
import _isNumber from 'lodash/isNumber'
import _isString from 'lodash/isString'
import _replace from 'lodash/replace'

import {
  AccumulateDistribute, Recurring, TWAP,
} from 'bfx-hf-algo'
import { getCurrencyDefinition } from '../../components/OrderForm/FieldComponents/fields.helpers'

const getContext = (symbol, markets) => {
  const market = markets[symbol]

  if (_includes(market?.contexts, 'f')) {
    return 'f'
  }

  return 'e'
}

const flagsMapping = {
  hidden: 64,
  close: 512,
  reduceonly: 1024,
  postonly: 4096,
  oco: 16384,
}

const calculateFlags = (order) => {
  const flags = _keys(flagsMapping)
  return _reduce(
    flags,
    (prev, curr) => {
      return order[curr] ? prev + flagsMapping[curr] : prev
    },
    0,
  )
}

const processUpdateOrder = (order, id) => ({
  ...order,
  id,
  amount: _toString(order.amount),
  price: order.price && _toString(order.price),
  price_trailing: order.priceTrailing && _toString(order.priceTrailing),
  price_aux_limit: order.priceAuxLimit && _toString(order.priceAuxLimit),
  meta: {
    make_visible: _toNumber(order.visibleOnHit),
  },
  flags: calculateFlags(order),
})

const processAOArgs = (args, id, isRelaunching) => {
  const updArgs = { ...args }
  updArgs.amount = Math.abs(updArgs.amount)

  switch (id) {
    case AccumulateDistribute.id:
    case TWAP.id:
      if (_isNumber(updArgs.sliceInterval)) {
        updArgs.sliceIntervalSec = updArgs.sliceInterval / 1000
      }
      break

    case Recurring.id:
      if (isRelaunching) {
        updArgs.startedAt = null
        updArgs.endedAt = null
      } else {
        if (_isString(updArgs.startedAt)) {
          updArgs.startedAt = new Date(updArgs.startedAt)
        }
        if (_isString(updArgs.endedAt)) {
          updArgs.endedAt = new Date(updArgs.endedAt)
        }
      }
      updArgs.currency = getCurrencyDefinition(updArgs.currency, updArgs.symbol)

      break

    default:
      break
  }

  if (updArgs.orderType && _includes(updArgs.orderType, 'EXCHANGE')) {
    // the reason - https://github.com/bitfinexcom/bfx-hf-algo/blob/master/lib/twap/meta/process_params.js#L19
    updArgs.orderType = _replace(updArgs.orderType, /EXCHANGE /g, '')
  }

  if (updArgs.sliceAmount) {
    updArgs.sliceAmount = Math.abs(updArgs.sliceAmount)
  }

  return updArgs
}

const processAtomic = (order) => {
  const newOrder = { ...order }
  newOrder.amount = Math.abs(newOrder.amount)
  if (newOrder.priceTrailing) {
    newOrder.distance = newOrder.priceTrailing
  }
  return newOrder
}

export {
  getContext, processAOArgs, processUpdateOrder, processAtomic,
}
