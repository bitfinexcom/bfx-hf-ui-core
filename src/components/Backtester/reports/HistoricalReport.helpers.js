import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _split from 'lodash/split'
import _replace from 'lodash/replace'

const getExportFilename = (activeMarket) => {
  // turn something like 2022-02-22T12:55:03.800Z into 2022-02-22T12-55-03
  const date = _replace(_split(new Date().toISOString(), '.')[0], /:/g, '-')
  return `${activeMarket}-${date}.zip`
}

const onTradeExportClick = (rawTrades, activeMarket, t) => {
  if (_isEmpty(rawTrades)) {
    return
  }

  const trades = _map(rawTrades, ({
    price, amount, pl, label, mts,
  }) => ({
    [t('table.price')]: price,
    [t('table.amount')]: amount,
    [t('table.pl')]: pl,
    [t('table.label')]: label,
    [t('table.time')]: _replace(new Date(mts).toLocaleString(), ',', ''),
  }))

  const documents = {
    trades,
  }

  csvExport.export(documents, (buffer) => {
    const blob = new Blob([buffer], { type: 'application/zip' })
    const filename = getExportFilename(activeMarket)

    saveAs(blob, filename)
  })
}

export {
  onTradeExportClick,
}
