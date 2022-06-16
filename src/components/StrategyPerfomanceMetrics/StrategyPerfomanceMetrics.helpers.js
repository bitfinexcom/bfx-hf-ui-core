import csvExport from 'csv-export'
import { preparePrice } from 'bfx-api-node-util'
import { saveAs } from 'file-saver'

import { getPairFromMarket } from '../../util/market'
import { resultNumber } from '../Backtester/Results/Results.utils'
import { getExportFilename } from '../StrategyTradesTable/StrategyTradesTable.helpers'

const adjustPercentage = (value) => value * 100

const getMetrics = (results, t, quoteCcy, postProcessing = false) => {
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

  if (postProcessing) {
    return {
      [t('strategyEditor.totalPL')]: resultNumber(preparePrice(pl), quoteCcy),
      [t('strategyEditor.avgPL')]: resultNumber(avgPL, quoteCcy),
      [t('strategyEditor.profitFactor')]: resultNumber(pf),
      [t('strategyEditor.volatility')]: resultNumber(stdDeviation),
      [t('strategyEditor.allocation')]: resultNumber(allocation, quoteCcy),
      [t('strategyEditor.positionSize')]: resultNumber(positionSize),
      [t('strategyEditor.currentAllocation')]: resultNumber(currentAllocation, quoteCcy),
      [t('strategyEditor.availableFunds')]: resultNumber(availableFunds, quoteCcy),
      [t('strategyEditor.equityCurve')]: resultNumber(equityCurve),
      [t('strategyEditor.ret')]: resultNumber(ret, quoteCcy),
      [t('strategyEditor.retPerc')]: resultNumber(adjustPercentage(retPerc)),
      [t('strategyEditor.drawdown')]: resultNumber(adjustPercentage(drawdown)),
      [t('strategyEditor.backtestCandles')]: nCandles,
      [t('strategyEditor.backtestTrades')]: nTrades,
      [t('strategyEditor.trades')]: nStrategyTrades,
      [t('strategyEditor.positions')]: nOpens,
      [t('strategyEditor.gains')]: nGains,
      [t('strategyEditor.losses')]: nLosses,
      [t('strategyEditor.fees')]: resultNumber(fees, quoteCcy),
      [t('strategyEditor.volume')]: vol,
      [t('strategyEditor.largestGain')]: resultNumber(maxPL, quoteCcy),
      [t('strategyEditor.largestLoss')]: resultNumber(minPL, quoteCcy),
    }
  }

  return {
    [t('strategyEditor.totalPL')]: pl,
    [t('strategyEditor.avgPL')]: avgPL,
    [t('strategyEditor.profitFactor')]: pf,
    [t('strategyEditor.volatility')]: stdDeviation,
    [t('strategyEditor.allocation')]: allocation,
    [t('strategyEditor.positionSize')]: positionSize,
    [t('strategyEditor.currentAllocation')]: currentAllocation,
    [t('strategyEditor.availableFunds')]: availableFunds,
    [t('strategyEditor.equityCurve')]: equityCurve,
    [t('strategyEditor.ret')]: ret,
    [t('strategyEditor.retPerc')]: retPerc,
    [t('strategyEditor.drawdown')]: drawdown,
    [t('strategyEditor.backtestCandles')]: nCandles,
    [t('strategyEditor.backtestTrades')]: nTrades,
    [t('strategyEditor.trades')]: nStrategyTrades,
    [t('strategyEditor.positions')]: nOpens,
    [t('strategyEditor.gains')]: nGains,
    [t('strategyEditor.losses')]: nLosses,
    [t('strategyEditor.fees')]: fees,
    [t('strategyEditor.volume')]: vol,
    [t('strategyEditor.largestGain')]: maxPL,
    [t('strategyEditor.largestLoss')]: minPL,
  }
}

const metricsExport = (results, t, getCurrencySymbol) => {
  const {
    backtestOptions: { activeMarket } = {},
  } = results
  const metrics = [getMetrics(results, t)]

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
  metricsExport, getMetrics,
}
