import React from 'react'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairParts } from '@ufx-ui/utils'
import { preparePrice } from 'bfx-api-node-util'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import { resultNumber } from '../Backtester/Results/Results.utils'
import MetricRow from './MetricRow'
import ExecutionTimer from './ExecutionTimer'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const adjustPercentage = value => value * 100

const StrategyPerfomanceMetrics = ({
  results,
  startedOn,
  isExecuting,
  isBacktest,
}) => {
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
      label={t('strategyEditor.perfomanceMetrics.title')}
    >
      <ul>
        {!isBacktest && (
          <ExecutionTimer isExecuting={isExecuting} startedOn={startedOn} />
        )}
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
          label={t('strategyEditor.allocation')}
          value={resultNumber(allocation, quoteCcy)}
        />
        <MetricRow
          label={t('strategyEditor.positionSize')}
          value={resultNumber(positionSize)}
        />
        <MetricRow
          label={t('strategyEditor.currentAllocation')}
          value={resultNumber(currentAllocation, quoteCcy)}
        />
        <MetricRow
          label={t('strategyEditor.availableFunds')}
          value={resultNumber(availableFunds, quoteCcy)}
        />
        <MetricRow
          label={t('strategyEditor.equityCurve')}
          value={resultNumber(equityCurve)}
        />
        <MetricRow
          label={t('strategyEditor.ret')}
          value={resultNumber(ret, quoteCcy)}
        />
        <MetricRow
          label={t('strategyEditor.retPerc')}
          value={resultNumber(adjustPercentage(retPerc))}
        />
        <MetricRow
          label={t('strategyEditor.drawdown')}
          value={resultNumber(adjustPercentage(drawdown))}
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
    }),
    allocation: PropTypes.number,
    positionSize: PropTypes.string,
    currentAllocation: PropTypes.string,
    availableFunds: PropTypes.string,
    equityCurve: PropTypes.string,
    return: PropTypes.string,
    returnPerc: PropTypes.string,
    drawdown: PropTypes.string,
  }),
  isExecuting: PropTypes.bool.isRequired,
  startedOn: PropTypes.number,
  isBacktest: PropTypes.bool,
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
  startedOn: 0,
  isBacktest: false,
}

export default StrategyPerfomanceMetrics
