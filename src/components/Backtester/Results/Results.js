import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { getPairParts } from '@ufx-ui/utils'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'

import { preparePrice } from 'bfx-api-node-util'
import ResultRow from './ResultRow'
import ResultHeader from './ResultHeader'
import { resultNumber } from './Results.utils'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const Results = ({ results }) => {
  const {
    nCandles, nTrades, nGains, nLosses, nStrategyTrades, nOpens, pl, pf,
    maxPL, minPL, fees, vol, stdDeviation, avgPL, backtestOptions: { activeMarket } = {},
  } = results
  const hasTrades = !!vol

  const [, quote] = getPairParts(activeMarket)
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const quoteCcy = getCurrencySymbol(quote)
  const { t } = useTranslation()

  return (
    <div className='hfui-strategyeditor__results-wrapper'>
      <div className='hfui-strategyeditor__results-header'>
        <ResultHeader label={t('strategyEditor.totalPL')} value={resultNumber(preparePrice(pl), quoteCcy)} />
        <ResultHeader label={t('strategyEditor.avgPL')} value={resultNumber(avgPL, quoteCcy)} />
        <ResultHeader label={t('strategyEditor.profitFactor')} value={resultNumber(pf)} />
        <ResultHeader label={t('strategyEditor.volatility')} value={resultNumber(stdDeviation)} />
      </div>
      <div key='results-left' className='hfui-strategyeditor__results-section results-left'>
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

      <div key='results-right' className='hfui-strategyeditor__results-section results-right'>
        <ul>
          <ResultRow label={t('strategyEditor.fees')} value={resultNumber(preparePrice(-fees), quoteCcy)} />
          <ResultRow label={t('strategyEditor.profitLoss')} value={resultNumber(preparePrice(pl), quoteCcy)} />
          {hasTrades && (
            <>
              <ResultRow label={t('strategyEditor.profitFactor')} value={resultNumber(pf)} />
              <ResultRow label={t('strategyEditor.volume')} value={resultNumber(vol, quoteCcy)} />
              <ResultRow label={t('strategyEditor.largestGain')} value={resultNumber(preparePrice(maxPL), quoteCcy)} />
              <ResultRow label={t('strategyEditor.largestLoss')} value={resultNumber(preparePrice(minPL), quoteCcy)} />
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
    backtestOptions: PropTypes.shape({
      activeMarket: PropTypes.string,
    }).isRequired,
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
    backtestOptions: {
      activeMarket: null,
    },
  },
}

export default memo(Results)
