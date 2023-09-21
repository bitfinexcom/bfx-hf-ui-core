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
}) => {
  const {
    timestamp,
    symbol,
    start,
    end,
    capitalAllocation,
    stopLossPerc,
    maxDrawdownPerc,
    margin,
    useMaxLeverage,
    increaseLeverage,
    leverage,
    addStopOrder,
    stopOrderPercent,
  } = rowData

  const backtestDetailsConfig = [
    {
      label: t('strategyEditor.executedAt'),
      value: renderDate(timestamp, formatTime),
    },
    {
      label: t('strategyEditor.tradingPair'),
      value: symbol,
    },
    {
      label: t('strategyEditor.startDate'),
      value: renderDate(start, formatTime),
    },
    {
      label: t('strategyEditor.endDate'),
      value: renderDate(end, formatTime),
    },
    {
      label: t('strategyEditor.source'),
      value: getBacktestSourceField(rowData, t),
    },
    {
      label: t('strategySettingsModal.capitalAllocationLabel'),
      value: `${capitalAllocation} ${quoteCcy}`,
    },
    {
      label: t('strategySettingsModal.stopLoss'),
      value: `${stopLossPerc}%`,
    },
    {
      label: t('strategySettingsModal.maxDrawdown'),
      value: `${maxDrawdownPerc}%`,
    },
  ]

  if (margin) {
    backtestDetailsConfig.push({
      label: t('strategySettingsModal.leverage'),
      value: useMaxLeverage
        ? t('strategySettingsModal.maxMarginTradeMode')
        : t('strategySettingsModal.leverageDetails', {
          value: leverage,
          details: t(
            `strategySettingsModal.${
              increaseLeverage
                ? 'leverageCouldBeIncreased'
                : 'leverageFixed'
            }`,
          ),
        }),
    })
  }

  if (addStopOrder && stopOrderPercent) {
    backtestDetailsConfig.push({
      label: t('strategySettingsModal.stopOrder'),
      value: `${stopOrderPercent}${t('strategySettingsModal.stopOrderValuePlaceholder')}`,
    })
  }

  return backtestDetailsConfig
}
