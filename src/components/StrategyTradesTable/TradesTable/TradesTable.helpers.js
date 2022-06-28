import _replace from 'lodash/replace'

export const getTradeAmount = (trade) => trade?.order_js?.amountOrig || trade?.order_js?.amount || trade?.amount

export const getTradePriceAvg = (trade) => trade?.order_js?.priceAvg

export const getTradePrice = (trade) => trade?.order_js?.price

export const getTradeType = (trade) => trade?.order_js?.type

export const getTradeTimestamp = (trade) => _replace(new Date(trade?.order_js?.mtsCreate).toLocaleString(), ',', '')

export const getTradeExecutedAt = (trade) => _replace(new Date(trade?.order_js?.mtsUpdate).toLocaleString(), ',', '')

export const getOrderID = (trade) => trade?.order_id

export const getTradeTime = (trade) => trade?.order_js?.mtsCreate

export const getTradesHeaders = (t) => ({
  id: t('table.id'),
  action: t('table.action'),
  type: t('table.type'),
  timestamp: t('table.timestamp'),
  executedAt: t('table.executedAt'),
  orderPrice: t('table.orderPrice'),
  tradePrice: t('table.tradePrice'),
  amount: t('table.amount'),
})

export const getPositionsHeaders = (t) => ({
  id: t('table.id'),
  entryAt: t('table.entryAt'),
  closedAt: t('table.leftAt'),
  entryPrice: t('table.entryPrice'),
  closingPrice: t('table.closingPrice'),
  amount: t('table.amount'),
  pl: t('table.pl'),
})
