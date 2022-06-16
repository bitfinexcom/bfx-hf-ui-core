import React, { useMemo } from 'react'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import { getPairParts } from '@ufx-ui/utils'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon } from 'react-fa'
import _map from 'lodash/map'

import Panel from '../../ui/Panel'
import MetricRow from './MetricRow'
import ExecutionTimer from './ExecutionTimer'
import { metricsExport, getMetrics } from './StrategyPerfomanceMetrics.helpers'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const StrategyPerfomanceMetrics = ({
  results,
  startedOn,
  isExecuting,
  isBacktest,
}) => {
  const { t } = useTranslation()
  const {
    backtestOptions: { activeMarket } = {},
  } = results

  const [, quote] = activeMarket ? getPairParts(activeMarket) : []
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const quoteCcy = getCurrencySymbol(quote)
  const metrics = useMemo(() => getMetrics(results, t, quoteCcy, false), [results, t, quoteCcy])

  return (
    <Panel
      moveable={false}
      removeable={false}
      darkHeader
      label={t('strategyEditor.perfomanceMetrics.title')}
      extraIcons={(
        <Icon onClick={() => metricsExport(results, t, getCurrencySymbol)} name='download' />
      )}
    >
      <ul>
        {!isBacktest && startedOn && (
          <ExecutionTimer isExecuting={isExecuting} startedOn={startedOn} />
        )}
        {_map(metrics, (value, label) => (
          <MetricRow
            key={label}
            label={label}
            value={value}
          />
        ))}
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
    allocation: PropTypes.string,
    positionSize: PropTypes.string,
    currentAllocation: PropTypes.string,
    availableFunds: PropTypes.string,
    equityCurve: PropTypes.string,
    return: PropTypes.string,
    returnPerc: PropTypes.string,
    drawdown: PropTypes.string,
  }),
  isExecuting: PropTypes.bool,
  isBacktest: PropTypes.bool,
  startedOn: PropTypes.number,
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
  isBacktest: false,
  startedOn: 0,
  isExecuting: false,
}

export default StrategyPerfomanceMetrics
