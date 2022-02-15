import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import { preparePrice } from 'bfx-api-node-util'
import ResultRow from './ResultRow'
import ResultHeader from './ResultHeader'

import './style.css'

const resultNumber = (value, prefix = '', maxDecimals = 2, color = true) => {
  let val = Number(Number(value).toFixed(maxDecimals))
  if (Number.isNaN(val)) {
    val = 0
  }
  const valueString = val.toLocaleString()
  if (Number(value) < 0) {
    return <span style={{ color: color ? 'red' : '' }}>{prefix + valueString}</span>
  }
  return <span style={{ color: color ? 'green' : '' }}>{prefix + valueString}</span>
}

const Results = ({ results }) => {
  const {
    nCandles, nTrades, nGains, nLosses, nStrategyTrades, nOpens, pl, pf,
    maxPL, minPL, fees, vol, stdDeviation, avgPL,
  } = results
  const hasTrades = !!vol
  const { t } = useTranslation()

  return (
    <div className='hfui-strategyeditor__results-wrapper'>
      <div className='hfui-strategyeditor__results-header'>
        <ResultHeader label={t('strategyEditor.totalPL')} value={resultNumber(preparePrice(pl), '$')} />
        <ResultHeader label={t('strategyEditor.avgPL')} value={resultNumber(avgPL, '$', 2)} />
        <ResultHeader label={t('strategyEditor.profitFactor')} value={resultNumber(pf, '', 2, false)} />
        <ResultHeader label={t('strategyEditor.volatility')} value={resultNumber(stdDeviation, '', 2, false)} />
      </div>
      <div key='results-left' className='hfui-strategyeditor__results-section'>
        <ul>
          <ResultRow label={t('strategyEditor.backtestCandles')} value={nCandles} />
          <ResultRow label={t('strategyEditor.backtestTrades')} value={nTrades} />
          {hasTrades
            && (
              <>
                <ResultRow label={t('strategyEditor.trades')} value={nStrategyTrades} />
                <ResultRow label={t('strategyEditor.positions')} value={nOpens} />
                <ResultRow label={t('strategyEditor.gains')} value={nGains} />
                <ResultRow label={t('strategyEditor.losses')} value={nLosses} />
              </>
            )}
        </ul>
      </div>

      <div key='results-right' className='hfui-strategyeditor__results-section'>
        <ul>
          <ResultRow label={t('strategyEditor.fees')} value={resultNumber(preparePrice(-fees), '$')} />
          <ResultRow label={t('strategyEditor.profitLoss')} value={resultNumber(preparePrice(pl), '$')} />
          {hasTrades && (
            <>
              <ResultRow label={t('strategyEditor.profitFactor')} value={resultNumber(pf, '', 2, false)} />
              <ResultRow label={t('strategyEditor.volume')} value={resultNumber(vol, '$')} />
              <ResultRow label={t('strategyEditor.largestGain')} value={resultNumber(preparePrice(maxPL), '$')} />
              <ResultRow label={t('strategyEditor.largestLoss')} value={resultNumber(preparePrice(minPL), '$')} />
            </>
          )}
        </ul>
      </div>
    </div>
  )
}

Results.propTypes = {
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
  }),
}

Results.defaultProps = {
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
  },
}

export default memo(Results)
