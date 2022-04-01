import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairParts } from '@ufx-ui/utils'
import { preparePrice } from 'bfx-api-node-util'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import { resultNumber } from '../Backtester/Results/Results.utils'
import MetricRow from './MetricRow'

import './style.scss'

const { getCurrencySymbolMemo } = reduxSelectors

const StrategyPerfomanceMetrics = ({ results }) => {
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
    backtestOptions: { activeMarket } = {},
  } = results
  const hasTrades = !!vol

  const [, quote] = getPairParts(activeMarket)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const quoteCcy = getCurrencySymbol(quote)
  const { t } = useTranslation()

  return (
    <Panel
      moveable={false}
      removeable={false}
      darkHeader
      label='Perfomance metrics'
    >
      <ul>
        <MetricRow
          label={t('strategyEditor.totalPL')}
          value={resultNumber(preparePrice(pl), quoteCcy)}
        />
        <MetricRow
          label={t('strategyEditor.avgPL')}
          value={resultNumber(avgPL, quoteCcy)}
        />
        <MetricRow
          label={t('strategyEditor.profitFactor')}
          value={resultNumber(pf)}
        />
        <MetricRow
          label={t('strategyEditor.volatility')}
          value={resultNumber(stdDeviation)}
        />
        <MetricRow
          label={t('strategyEditor.backtestCandles')}
          value={nCandles}
        />
        <MetricRow label={t('strategyEditor.backtestTrades')} value={nTrades} />
        {hasTrades && (
          <>
            <MetricRow
              label={t('strategyEditor.trades')}
              value={nStrategyTrades}
            />
            <MetricRow label={t('strategyEditor.positions')} value={nOpens} />
            <MetricRow label={t('strategyEditor.gains')} value={nGains} />
            <MetricRow label={t('strategyEditor.losses')} value={nLosses} />
          </>
        )}
      </ul>
    </Panel>
  )
}

export default StrategyPerfomanceMetrics
