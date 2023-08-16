import { renderDate } from '../../../util/ui'

const getBacktestSourceField = (rowData, t) => {
  const { includeCandles } = rowData
  if (includeCandles) {
    return t('strategyEditor.candlesSource', {
      timeframe: t(`time.${rowData.timeframe}`),
      candleSeed: rowData.candleSeed,
    })
  }
  return t('strategyEditor.trades')
}

export default ({
  t, rowData = {}, formatTime, quoteCcy,
}) => [
  {
    label: t('strategyEditor.executedAt'),
    value: renderDate(rowData.timestamp, formatTime),
  },
  {
    label: t('strategyEditor.tradingPair'),
    value: rowData.symbol,
  },
  {
    label: t('strategyEditor.startDate'),
    value: renderDate(rowData.start, formatTime),
  },
  {
    label: t('strategyEditor.endDate'),
    value: renderDate(rowData.end, formatTime),
  },
  {
    label: t('strategyEditor.source'),
    value: getBacktestSourceField(rowData, t),
  },
  {
    label: t('strategySettingsModal.capitalAllocationLabel'),
    value: `${rowData.capitalAllocation} ${quoteCcy}`,
  },
  {
    label: t('strategySettingsModal.stopLoss'),
    value: `${rowData.stopLossPerc}%`,
  },
  {
    label: t('strategySettingsModal.maxDrawdown'),
    value: `${rowData.maxDrawdownPerc}%`,
  },
]
