import csvExport from 'csv-export'
import { preparePrice } from 'bfx-api-node-util'
import { saveAs } from 'file-saver'

import { getPairFromMarket } from '../../util/market'
import resultNumber from '../../util/resultNumber'
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
    profitFactor = 0,
    vol = 0,
    pnlStdDeviation = 0,
    averageTradePnl = 0,
    allocation = 0,
    positionSize = 0,
    currentAllocation = 0,
    availableFunds = 0,
    equityCurve = 0,
    return: ret = 0,
    returnPerc: retPerc = 0,
    drawdown = 0,
    largestGain = 0,
    largestLoss = 0,
    realizedStrategyPnl = 0,
    unrealizedStrategyPnl = 0,
  } = results

  if (postProcessing) {
    return {
      [t('strategyEditor.totalPL')]: resultNumber(preparePrice(realizedStrategyPnl), quoteCcy),
      [t('strategyEditor.unrealizedStrategyPnl')]: resultNumber(preparePrice(unrealizedStrategyPnl), quoteCcy),
      [t('strategyEditor.avgPL')]: resultNumber(averageTradePnl, quoteCcy),
      // profitFactor should be red if less than 1
      [t('strategyEditor.profitFactor')]: resultNumber(profitFactor, null, profitFactor >= 1),
      [t('strategyEditor.volatility')]: resultNumber(pnlStdDeviation),
      [t('strategyEditor.allocation')]: resultNumber(allocation, quoteCcy),
      [t('strategyEditor.positionSize')]: resultNumber(positionSize),
      [t('strategyEditor.currentAllocation')]: resultNumber(currentAllocation, quoteCcy),
      [t('strategyEditor.availableFunds')]: resultNumber(availableFunds, quoteCcy),
      [t('strategyEditor.equityCurve')]: resultNumber(equityCurve),
      [t('strategyEditor.ret')]: resultNumber(ret, quoteCcy),
      [t('strategyEditor.retPerc')]: resultNumber(adjustPercentage(retPerc)),
      [t('strategyEditor.drawdown')]: resultNumber(adjustPercentage(drawdown), null, false),
      [t('strategyEditor.backtestCandles')]: nCandles,
      [t('strategyEditor.backtestTrades')]: nTrades,
      [t('strategyEditor.trades')]: nStrategyTrades,
      [t('strategyEditor.positions')]: nOpens,
      [t('strategyEditor.gains')]: nGains,
      [t('strategyEditor.losses')]: nLosses,
      [t('strategyEditor.volume')]: vol,
      [t('strategyEditor.largestGain')]: resultNumber(largestGain, quoteCcy),
      [t('strategyEditor.largestLoss')]: resultNumber(largestLoss, quoteCcy),
    }
  }

  return {
    [t('strategyEditor.totalPL')]: realizedStrategyPnl,
    [t('strategyEditor.unrealizedStrategyPnl')]: unrealizedStrategyPnl,
    [t('strategyEditor.avgPL')]: averageTradePnl,
    [t('strategyEditor.profitFactor')]: profitFactor,
    [t('strategyEditor.volatility')]: pnlStdDeviation,
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
    [t('strategyEditor.volume')]: vol,
    [t('strategyEditor.largestGain')]: largestGain,
    [t('strategyEditor.largestLoss')]: largestLoss,
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
