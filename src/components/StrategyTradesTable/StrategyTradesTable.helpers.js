import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import _map from 'lodash/map'
import _split from 'lodash/split'
import _replace from 'lodash/replace'
import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { getPairFromMarket } from '../../util/market'
import {
  getTradesHeaders, getPositionsHeaders, getTradeType, getTradePriceAvg,
  getTradePrice, getTradeAmount, getOrderID, getTradeTimestamp, getTradeExecutedAt,
} from './TradesTable/TradesTable.helpers'

const getExportFilename = (prefix, extension = 'zip') => {
  // turn something like 2022-02-22T12:55:03.800Z into 2022-02-22T12-55-03
  const date = _replace(_split(new Date().toISOString(), '.')[0], /:/g, '-')
  return `${prefix}-${date}.${extension}`
}

const onTradeExportClick = (rawPositions, activeMarket, t, getCurrencySymbol) => {
  const tHeaders = getTradesHeaders(t)
  const pHeaders = getPositionsHeaders(t)

  const positions = _map(rawPositions, ({
    amount, entryPrice, closingPrice, entryAt, closedAt, id, pl,
  }) => ({
    [pHeaders.id]: id,
    [pHeaders.entryAt]: _replace(new Date(entryAt).toLocaleString(), ',', ''),
    [pHeaders.closedAt]: _replace(new Date(closedAt).toLocaleString(), ',', ''),
    [pHeaders.entryPrice]: entryPrice,
    [pHeaders.closingPrice]: closingPrice,
    [pHeaders.amount]: amount,
    [pHeaders.pl]: pl,
  }))

  const rawTrades = _reduce(rawPositions, (acc, position) => {
    const { trades } = position

    if (_isEmpty(trades)) {
      return acc
    }

    return [...acc, ...trades]
  }, [])

  // {
  //   amount, order_id: orderID, order_js: order,
  // }
  const trades = _map(rawTrades, (trade) => ({
    [tHeaders.id]: getOrderID(trade),
    [tHeaders.action]: getTradeAmount(trade) < 0 ? 'SELL' : 'BUY',
    [tHeaders.type]: getTradeType(trade),
    [tHeaders.timestamp]: getTradeTimestamp(trade),
    [tHeaders.executedAt]: getTradeExecutedAt(trade),
    [tHeaders.orderPrice]: getTradePrice(trade),
    [tHeaders.tradePrice]: getTradePriceAvg(trade),
    [tHeaders.amount]: getTradeAmount(trade),
  }))

  const documents = {
    positions,
    trades,
  }

  csvExport.export(documents, (buffer) => {
    const blob = new Blob([buffer], { type: 'application/zip' })
    const filename = getExportFilename(getPairFromMarket(activeMarket, getCurrencySymbol, '-'))

    saveAs(blob, filename)
  })
}

export {
  onTradeExportClick, getExportFilename,
}
