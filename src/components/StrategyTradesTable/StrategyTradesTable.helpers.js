import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import _map from 'lodash/map'
import _split from 'lodash/split'
import _replace from 'lodash/replace'
import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { getPairFromMarket } from '../../util/market'
import { formatDate } from '../../util/ui'
import {
  getTradesHeaders, getPositionsHeaders, getTradeType, getTradePriceAvg,
  getTradePrice, getTradeAmount, getOrderID, getTradeTimestamp, getTradeExecutedAt,
} from './TradesTable/TradesTable.helpers'

export const getPositionEntryAt = (position, asRawString) => formatDate(position.entryAt, asRawString)

export const getPositionClosedAt = (position, asRawString) => formatDate(position.closedAt, asRawString)

export const getPositionEntryPrice = (position) => position.entryPrice

export const getPositionClosingPrice = (position) => position.closingPrice

export const getPositionAmount = (position) => position.amount

export const getPositionId = (position) => position.id

export const getPositionPl = (position) => position.pl

const getExportFilename = (prefix, extension = 'zip') => {
  // turn something like 2022-02-22T12:55:03.800Z into 2022-02-22T12-55-03
  const date = _replace(_split(new Date().toISOString(), '.')[0], /:/g, '-')
  return `${prefix}-${date}.${extension}`
}

const onTradeExportClick = (rawPositions, activeMarket, t, getCurrencySymbol) => {
  const tHeaders = getTradesHeaders(t)
  const pHeaders = getPositionsHeaders(t)
  console.log(rawPositions)

  const positions = _map(rawPositions, (position) => ({
    [pHeaders.id]: getPositionId(position),
    [pHeaders.entryAt]: getPositionEntryAt(position, true),
    [pHeaders.closedAt]: getPositionClosedAt(position, true),
    [pHeaders.entryPrice]: getPositionEntryPrice(position),
    [pHeaders.closingPrice]: getPositionClosingPrice(position),
    [pHeaders.amount]: getPositionAmount(position),
    [pHeaders.pl]: getPositionPl(position),
  }))

  const rawTrades = _reduce(rawPositions, (acc, position) => {
    const { trades } = position

    if (_isEmpty(trades)) {
      return acc
    }

    return [...acc, ...trades]
  }, [])

  const trades = _map(rawTrades, (trade) => ({
    [tHeaders.id]: getOrderID(trade),
    [tHeaders.action]: getTradeAmount(trade) < 0 ? 'SELL' : 'BUY',
    [tHeaders.type]: getTradeType(trade),
    [tHeaders.timestamp]: getTradeTimestamp(trade, true),
    [tHeaders.executedAt]: getTradeExecutedAt(trade, true),
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
