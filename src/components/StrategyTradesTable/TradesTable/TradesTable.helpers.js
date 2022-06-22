export const getTradeAmount = (trade) => trade?.order_js?.amountOrig || trade?.order_js?.amount

export const getTradePrice = (trade) => trade?.order_js?.priceAvg

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
