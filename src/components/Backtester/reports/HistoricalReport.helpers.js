import { ExportToCsv } from 'export-to-csv'
import { formatNumber } from '@ufx-ui/utils'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _split from 'lodash/split'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../../constants/precision'

const TRADE_CSV_OPTIONS = {
  fieldSeparator: ',',
  quoteStrings: '"',
  decimalSeparator: '.',
  showLabels: true,
  showTitle: true,
  useTextFile: false,
  useBom: true,
}

const onTradeExportClick = (trades, activeMarket, t) => {
  if (_isEmpty(trades)) {
    return
  }

  const csvExporter = new ExportToCsv({
    ...TRADE_CSV_OPTIONS,
    headers: [t('table.price'), t('table.amount'), t('table.pl'), t('table.label'), t('table.time')],
    filename: `${activeMarket}-${_split(new Date().toISOString(), '.')[0]}`,
    title: `Backtest ${activeMarket} trades report`,
  })

  const processedTrades = _map(trades, ({
    price, amount, pl, label, mts,
  }) => ({
    price: formatNumber({ number: price, significantFigures: PRICE_SIG_FIGS, useGrouping: true }),
    amount: formatNumber({ number: amount, decimals: AMOUNT_DECIMALS, useGrouping: true }),
    pl: formatNumber({ number: pl, decimals: AMOUNT_DECIMALS, useGrouping: true }),
    label,
    mts: new Date(mts).toLocaleString(),
  }))

  csvExporter.generateCsv(processedTrades)
}

export {
  onTradeExportClick,
}
