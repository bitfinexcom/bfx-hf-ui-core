import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import _map from 'lodash/map'
import _replace from 'lodash/replace'
import { getPairFromMarket } from '../../util/market'
import { getExportFilename } from '../StrategyTradesTable/StrategyTradesTable.helpers'

const onTradeExportClick = (rawTrades, results, activeMarket, t, getCurrencySymbol) => {
  const {
    nCandles,
    nTrades,
    nGains,
    nLosses,
    nStrategyTrades,
    nOpens,
    pl,
    pf,
    maxPL,
    minPL,
    fees,
    vol,
    stdDeviation,
    avgPL,
  } = results

  const tHeaders = {
    price: t('table.price'),
    amount: t('table.amount'),
    pl: t('table.pl'),
    label: t('table.label'),
    mts: t('table.time'),
    fee: t('table.fee'),
  }

  const trades = _map(rawTrades, ({
    price, amount, pl: tPl, fee, label, mts,
  }) => ({
    [tHeaders.price]: price,
    [tHeaders.amount]: amount,
    [tHeaders.pl]: tPl,
    [tHeaders.fee]: fee,
    [tHeaders.label]: label,
    [tHeaders.mts]: _replace(new Date(mts).toLocaleString(), ',', ''),
  }))

  const general = [{
    [t('strategyEditor.totalPL')]: pl,
    [t('strategyEditor.avgPL')]: avgPL || 0,
    [t('strategyEditor.profitFactor')]: pf || 0,
    [t('strategyEditor.volatility')]: stdDeviation,
    [t('strategyEditor.backtestCandles')]: nCandles,
    [t('strategyEditor.backtestTrades')]: nTrades,
    [t('strategyEditor.trades')]: nStrategyTrades,
    [t('strategyEditor.positions')]: nOpens,
    [t('strategyEditor.gains')]: nGains,
    [t('strategyEditor.losses')]: nLosses,
    [t('strategyEditor.fees')]: fees,
    [t('strategyEditor.profitLoss')]: pl,
    [t('strategyEditor.volume')]: vol,
    [t('strategyEditor.largestGain')]: maxPL || 0,
    [t('strategyEditor.largestLoss')]: minPL || 0,
  }]

  const documents = {
    trades,
    general,
  }

  csvExport.export(documents, (buffer) => {
    const blob = new Blob([buffer], { type: 'application/zip' })
    const filename = getExportFilename(getPairFromMarket(activeMarket, getCurrencySymbol, '-'))

    saveAs(blob, filename)
  })
}

export {
  onTradeExportClick,
}
