import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@ufx-ui/core'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'
import _includes from 'lodash/includes'

import RenderHistoricalReport from '../Backtester/reports/HistoricalReport'
import { THEMES } from '../../redux/selectors/ui'
import Button from '../../ui/Button'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import MarketSelect from '../MarketSelect'
import TimeFrameDropdown from '../TimeFrameDropdown'
import { getDefaultMarket } from '../../util/market'

import './style.css'

const renderReport = RenderHistoricalReport

const DEFAULT_TIMEFRAME = '1m'
const DEFAULT_SEED_COUNT = 150
const DEFAULT_USE_TRADES = false
const DEFAULT_USE_MARGIN = false

const LiveStrategyExecutor = ({
  strategyContent, markets, dsExecuteLiveStrategy, dsStopLiveStrategy, isExecuting,
  authToken, isLoading, options, isPaperTrading, results, theme, onDeleteIndicator,
  onAddIndicator, indicators,
}) => {
  const { t } = useTranslation()
  const [timeframe, setTimeframe] = useState(options.tf || DEFAULT_TIMEFRAME)
  const [symbol, setSymbol] = useState(options.symbol ? _find(markets, m => m.wsID === options.symbol) : getDefaultMarket(markets))
  const [trades, setTrades] = useState(options.includeTrades || DEFAULT_USE_TRADES)
  const [margin, setMargin] = useState(options.margin || DEFAULT_USE_MARGIN)
  const [candleSeed, setCandleSeed] = useState(options.seedCandleCount || DEFAULT_SEED_COUNT)
  const [seedError, setSeedError] = useState(null)

  const opts = {
    indicators, onAddIndicator, onDeleteIndicator,
  }

  const execResults = {
    ...results,
    trades: results?.strategy?.trades,
    backtestOptions: {
      activeMarket: options.symbol,
    },
  }

  const toggleExecutionState = () => {
    if (!seedError) {
      if (isExecuting) {
        dsStopLiveStrategy(authToken)
      } else {
        dsExecuteLiveStrategy(authToken, strategyContent.label, symbol?.wsID, timeframe, trades, strategyContent, candleSeed, margin)
      }
    }
  }

  const updateSeed = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    setSeedError(error)
    setCandleSeed(processed)
  }

  if (_isEmpty(strategyContent)) {
    return (
      <div className='hfui-live-strategy-executor__wrapper'>
        <p>
          {t('strategyEditor.liveExecution.createStrategy')}
        </p>
      </div>
    )
  }

  return (
    <div className='hfui-backtester__executionform hfui-backtester__wrapper hfui-live-strategy-executor__wrapper'>
      <div className='hfui-backtester_row'>
        <div className='hfui-backtester__flex_start'>
          <MarketSelect
            value={symbol}
            onChange={(selection) => {
              const sel = _find(markets, m => m.wsID === selection.wsID)
              if (!_includes(sel?.contexts, 'm')) {
                setMargin(false)
              }
              setSymbol(sel)
            }}
            markets={markets}
            renderWithFavorites
          />
        </div>
        <div className='hfui-backtester__flex_start'>
          <TimeFrameDropdown tf={timeframe} onChange={setTimeframe} />
        </div>
        <div>
          <Button
            onClick={toggleExecutionState}
            className='hfui-backtester__flex_start hfui-backtester__start-button'
            label={isExecuting ? 'Stop' : 'Start'}
            disabled={isLoading}
            green={!isExecuting}
          />
        </div>
      </div>
      <div className='hfui-backtester_row'>
        {!isPaperTrading && _includes(symbol?.contexts, 'm') && (
          <div className='hfui-backtester__flex_start'>
            <Checkbox
              label={t('strategyEditor.useMarginCheckbox')}
              checked={margin}
              onChange={setMargin}
            />
          </div>
        )}
        <div className='hfui-backtester__flex_start'>
          <Checkbox
            label={t('strategyEditor.useTradesCheckbox')}
            checked={trades}
            onChange={setTrades}
          />
        </div>
      </div>
      <div className='hfui-backtester_row'>
        <div className='hfui-backtester__flex_start'>
          <AmountInput
            className='hfui-backtester__flex_start-number-input'
            def={{ label: t('strategyEditor.candleSeedCount') }}
            validationError={seedError}
            value={candleSeed}
            onChange={updateSeed}
          />
        </div>
        <div className='hfui-backtester__flex_start' />
      </div>
      {isExecuting && !isLoading && (
        <p>
          {t('strategyEditor.liveExecution.executing')}
        </p>
      )}
      {isExecuting && isLoading && (
        <p>
          {t('strategyEditor.liveExecution.stopping')}
        </p>
      )}
      {!isExecuting && isLoading && (
        <p>
          {t('strategyEditor.liveExecution.preparing')}
        </p>
      )}
      {!isExecuting && !isLoading && (
        <p>
          {t('strategyEditor.liveExecution.realBalancesWarning')}
        </p>
      )}
      {!_isEmpty(results) && (
        renderReport(opts, execResults, execResults, options, t, theme)
      )}
    </div>
  )
}

LiveStrategyExecutor.propTypes = {
  indicators: PropTypes.arrayOf(PropTypes.array),
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  dsStopLiveStrategy: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  isExecuting: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  options: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.number, PropTypes.bool,
  ])).isRequired,
  strategyContent: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string.isRequired,
      PropTypes.oneOf([null]).isRequired,
    ]),
  ),
  markets: PropTypes.objectOf(PropTypes.object),
  isPaperTrading: PropTypes.bool.isRequired,
  theme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]),
  results: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.number, PropTypes.array, PropTypes.object,
  ])),
  onAddIndicator: PropTypes.func,
  onDeleteIndicator: PropTypes.func,
}

LiveStrategyExecutor.defaultProps = {
  indicators: [],
  strategyContent: {},
  markets: {},
  theme: THEMES.DARK,
  results: {},
  onAddIndicator: () => { },
  onDeleteIndicator: () => { },
}

export default memo(LiveStrategyExecutor)
