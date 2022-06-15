import csvExport from 'csv-export'
import { saveAs } from 'file-saver'
import { getPairFromMarket } from '../../util/market'
import { getExportFilename } from '../StrategyTradesTable/StrategyTradesTable.helpers'

const metricsExport = (results, t, getCurrencySymbol) => {
  const {
    nCandles = 0,
    nTrades = 0,
    nGains = 0,
    nLosses = 0,
    nStrategyTrades = 0,
    nOpens = 0,
    pl = 0,
    pf = 0,
    vol = 0,
    stdDeviation = 0,
    avgPL = 0,
    backtestOptions: { activeMarket } = {},
    allocation = 0,
    positionSize = 0,
    currentAllocation = 0,
    availableFunds = 0,
    equityCurve = 0,
    return: ret = 0,
    returnPerc: retPerc = 0,
    drawdown = 0,
    fees = 0,
    maxPL = 0,
    minPL = 0,
  } = results

  const metrics = [{
    [t('strategyEditor.totalPL')]: pl,
    [t('strategyEditor.avgPL')]: avgPL,
    [t('strategyEditor.profitFactor')]: pf,
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
    [t('strategyEditor.largestGain')]: maxPL,
    [t('strategyEditor.largestLoss')]: minPL,
    [t('strategyEditor.drawdown')]: drawdown,
    [t('strategyEditor.retPerc')]: retPerc,
    [t('strategyEditor.equityCurve')]: equityCurve,
    [t('strategyEditor.ret')]: ret,
    [t('strategyEditor.allocation')]: allocation,
    [t('strategyEditor.positionSize')]: positionSize,
    [t('strategyEditor.currentAllocation')]: currentAllocation,
    [t('strategyEditor.availableFunds')]: availableFunds,
  }]

  const documents = {
    metrics,
  }

  csvExport.export(documents, (buffer) => {
    const blob = new Blob([buffer], { type: 'application/zip' })
    const prefix = activeMarket ? `metrics-${getPairFromMarket(activeMarket, getCurrencySymbol, '-')}` : 'metrics'
    const filename = getExportFilename(prefix)

    saveAs(blob, filename)
  })
}

export {
  metricsExport,
}
