export const getTradeAmount = (trade) => trade?.order_js?.amountOrig || trade?.order_js?.amount

export const getTradePrice = (trade) => trade?.order_js?.priceAvg
