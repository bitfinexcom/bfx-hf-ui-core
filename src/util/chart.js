import _get from 'lodash/get'
import _toLower from 'lodash/toLower'
import _replace from 'lodash/replace'
import _includes from 'lodash/includes'
import { setSigFig, precision } from '@ufx-ui/utils'

import {
  isTrailingStop, isStopLimit, isLimit, isStop,
} from '../orders'

const ORDER_TYPE_ACRONYM_LIMIT = 'L'
const ORDER_TYPE_ACRONYM_STOP_LIMIT = 'SL'
const ORDER_TYPE_ACRONYM_TRAILING_STOP = 'T'
const ORDER_TYPE_ACRONYM_STOP = 'S'

const orderTypes = {
  [ORDER_TYPE_ACRONYM_LIMIT]: 'LIMIT',
  [ORDER_TYPE_ACRONYM_STOP_LIMIT]: 'STOP LIMIT',
  [ORDER_TYPE_ACRONYM_TRAILING_STOP]: 'TRAILING STOP',
  [ORDER_TYPE_ACRONYM_STOP]: 'STOP',
}

export const ORDER_CONTEXT = {
  EXCHANGE: 'EXCHANGE',
  MARGIN: 'MARGIN',
  DERIVATIVE: 'DERIVATIVE',
}

function orderTypeLetter(type, t) {
  if (isStopLimit(type, t)) {
    return ORDER_TYPE_ACRONYM_STOP_LIMIT
  }

  if (isLimit(type, t)) {
    return ORDER_TYPE_ACRONYM_LIMIT
  }

  if (isTrailingStop(type, t)) {
    return ORDER_TYPE_ACRONYM_TRAILING_STOP
  }

  if (isStop(type, t)) {
    return ORDER_TYPE_ACRONYM_STOP
  }
  return ''
}

const getOrderContext = (market, order) => {
  if (_includes(market?.context, 'f')) {
    return ORDER_CONTEXT.DERIVATIVE
  } if (_includes(order?.type, ORDER_CONTEXT.EXCHANGE)) {
    return ORDER_CONTEXT.EXCHANGE
  }
  return ORDER_CONTEXT.MARGIN
}

export const transformLeverage = ({ meta } = {}) => {
  const { lev = 100 } = meta || {}
  return lev
}

export const transformCollateral = (rowData = {}) => {
  const lev = transformLeverage(rowData)
  const { amount, price } = rowData
  return (Math.abs(amount) * price) / lev
}

export const getTooltip = (order, args = {}) => {
  const {
    getIsDerivativePair,
    getMarketBySymbol,
    getCurrencySymbol,
    t,
  } = args

  const ORDER_CONTEXT_LABEL = {
    [ORDER_CONTEXT.EXCHANGE]: t('chart.trading.order.context.exchange'),
    [ORDER_CONTEXT.MARGIN]: t('chart.trading.order.context.margin'),
    [ORDER_CONTEXT.DERIVATIVE]: t('chart.trading.order.context.derivative'),
  }

  const tooltipLines = []

  const market = getMarketBySymbol(order.symbol)
  const base = getCurrencySymbol(market?.base)
  const quote = getCurrencySymbol(market?.quote)

  // trading/derivative
  const processedType = _replace(_toLower(order.type), /(exchange )/i, '')
  const orderText = orderTypeLetter(processedType, t)
  const isTrailingStopOrder = isTrailingStop(processedType, t)
  const isStopLimitOrder = isStopLimit(processedType, t)

  tooltipLines.push(t('chart.trading.order.tooltip.type', {
    type: _get(orderTypes, orderText, ''),
  }))

  tooltipLines.push(t('chart.trading.order.tooltip.context', {
    context: ORDER_CONTEXT_LABEL[getOrderContext(market, order)],
  }))

  tooltipLines.push(t('chart.trading.order.tooltip.amount', {
    amount: setSigFig(order.amount_converted || order.amount),
    ccy: base,
  }))

  const showPriceLabel = !isTrailingStopOrder && !isStopLimitOrder
  if (showPriceLabel) {
    tooltipLines.push(t('chart.trading.order.tooltip.price', {
      price: setSigFig(order.price_converted || order.price),
      ccy: quote,
    }))
  }

  if (isTrailingStopOrder) {
    tooltipLines.push(t('chart.trading.order.tooltip.distance', {
      distance: order.priceTrailing,
      ccy: quote,
    }))
  }

  if (isStopLimitOrder) {
    tooltipLines.push(t('chart.trading.order.tooltip.stopPrice', {
      stopPrice: setSigFig(order.price),
      ccy: quote,
    }))
    tooltipLines.push(t('chart.trading.order.tooltip.limitPrice', {
      limitPrice: setSigFig(order.priceAuxLimit),
      ccy: quote,
    }))
  }

  if (getIsDerivativePair && getIsDerivativePair(order.symbol)) {
    tooltipLines.push(t('chart.trading.order.tooltip.leverage', {
      leverage: setSigFig(transformLeverage(order)),
      ccy: base,
    }))
    tooltipLines.push(t('chart.trading.order.tooltip.collateral', {
      collateral: setSigFig(transformCollateral(order)),
      ccy: quote,
    }))
  }

  tooltipLines.push(t('chart.trading.order.tooltip.placed', {
    placedDate: new Date(order.created).toLocaleString(),
  }))

  const tooltip = tooltipLines.join('\n')
  return [tooltip, orderText]
}

export const getPositionTooltip = (position, args) => {
  const {
    getMarketBySymbol,
    getCurrencySymbol,
    t,
  } = args

  const tooltipLines = []

  const market = getMarketBySymbol(position.symbol)
  const base = getCurrencySymbol(market?.base)
  const quote = getCurrencySymbol(market?.quote)

  tooltipLines.push(t('chart.trading.position.tooltip.amount', {
    amount: setSigFig(position.amount),
    ccy: base,
  }))

  tooltipLines.push(t('chart.trading.position.tooltip.basePrice', {
    basePrice: setSigFig(position.basePrice),
    ccy: quote,
  }))

  tooltipLines.push(t('chart.trading.position.tooltip.liqPrice', {
    liquidationPrice: setSigFig(position.liquidationPrice),
    ccy: quote,
  }))

  tooltipLines.push(t('chart.trading.position.tooltip.pl', {
    pl: setSigFig(position.pl),
    ccy: quote,
  }))

  tooltipLines.push(t('chart.trading.position.tooltip.plPercent', {
    plPercent: precision(position.plPerc, 2),
    ccy: quote,
  }))

  const tooltip = tooltipLines.join('\n')
  return tooltip
}
