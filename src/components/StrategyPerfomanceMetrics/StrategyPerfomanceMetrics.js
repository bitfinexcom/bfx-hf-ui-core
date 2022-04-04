import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairParts } from '@ufx-ui/utils'
import { preparePrice } from 'bfx-api-node-util'
import React from 'react'
import PropTypes from 'prop-types'
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

StrategyPerfomanceMetrics.propTypes = {
  results: PropTypes.shape({
    nCandles: PropTypes.number,
    nTrades: PropTypes.number,
    nGains: PropTypes.number,
    nLosses: PropTypes.number,
    nStrategyTrades: PropTypes.number,
    nOpens: PropTypes.number,
    pl: PropTypes.number,
    pf: PropTypes.number,
    maxPL: PropTypes.number,
    minPL: PropTypes.number,
    fees: PropTypes.number,
    vol: PropTypes.number,
    stdDeviation: PropTypes.number,
    avgPL: PropTypes.number,
    backtestOptions: PropTypes.shape({
      activeMarket: PropTypes.string,
    }).isRequired,
  }),
}

StrategyPerfomanceMetrics.defaultProps = {
  results: {
    nCandles: 0,
    nTrades: 0,
    nGains: 0,
    nLosses: 0,
    nStrategyTrades: 0,
    nOpens: 0,
    pl: 0,
    pf: 0,
    maxPL: 0,
    minPL: 0,
    fees: 0,
    vol: 0,
    stdDeviation: 0,
    avgPL: 0,
    backtestOptions: {
      activeMarket: null,
    },
  },
}

export default StrategyPerfomanceMetrics
