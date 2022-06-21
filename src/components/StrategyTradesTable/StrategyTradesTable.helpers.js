import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import _map from 'lodash/map'
import _split from 'lodash/split'
import _replace from 'lodash/replace'
import _isEmpty from 'lodash/isEmpty'
import _reduce from 'lodash/reduce'
import { getPairFromMarket } from '../../util/market'

const getExportFilename = (prefix, extension = 'zip') => {
  // turn something like 2022-02-22T12:55:03.800Z into 2022-02-22T12-55-03
  const date = _replace(_split(new Date().toISOString(), '.')[0], /:/g, '-')
  return `${prefix}-${date}.${extension}`
}

const onTradeExportClick = (rawPositions, activeMarket, t, getCurrencySymbol) => {
  const tHeaders = {
    id: t('table.id'),
    action: t('table.action'),
    type: t('table.type'),
    timestamp: t('table.timestamp'),
    executedAt: t('table.executedAt'),
    orderPrice: t('table.orderPrice'),
    tradePrice: t('table.tradePrice'),
    amount: t('table.amount'),
  }
  const pHeaders = {
    id: t('table.id'),
    entryAt: t('table.entryAt'),
    closedAt: t('table.leftAt'),
    entryPrice: t('table.entryPrice'),
    closingPrice: t('table.closingPrice'),
    amount: t('table.amount'),
    pl: t('table.pl'),
  }

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

  const trades = _map(rawTrades, ({
    amount, order_id: orderID, order_js: order,
  }) => ({
    [tHeaders.id]: orderID,
    [tHeaders.action]: amount < 0 ? 'SELL' : 'BUY',
    [tHeaders.type]: order.type,
    [tHeaders.timestamp]: new Date(order?.mtsCreate).toLocaleString(),
    [tHeaders.executedAt]: new Date(order?.mtsUpdate).toLocaleString(),
    [tHeaders.orderPrice]: order.price,
    [tHeaders.tradePrice]: order.priceAvg,
    [tHeaders.amount]: amount,
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
