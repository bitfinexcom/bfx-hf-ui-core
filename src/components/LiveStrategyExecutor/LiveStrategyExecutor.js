import React, { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Checkbox } from '@ufx-ui/core'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _isEmpty from 'lodash/isEmpty'

import Button from '../../ui/Button'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import MarketSelect from '../MarketSelect'
import TimeFrameDropdown from '../TimeFrameDropdown'
import { getDefaultMarket } from '../../util/market'

import './style.css'

const DEFAULT_TIMEFRAME = '1m'
const DEFAULT_SEED_COUNT = 150
const DEFAULT_USE_TRADES = false
const DEFAULT_USE_MARGIN = false

const LiveStrategyExecutor = ({
  strategyContent, markets, dsExecuteLiveStrategy, dsStopLiveStrategy, isExecuting, authToken, isLoading, options,
}) => {
  const { t } = useTranslation()
  const [timeframe, setTimeframe] = useState(options.tf || DEFAULT_TIMEFRAME)
  const [symbol, setSymbol] = useState(options.symbol ? _find(markets, m => m.wsID === options.symbol) : getDefaultMarket(markets))
  const [trades, setTrades] = useState(options.includeTrades || DEFAULT_USE_TRADES)
  const [margin, setMargin] = useState(options.includeMargin || DEFAULT_USE_MARGIN)
  const [candleSeed, setCandleSeed] = useState(options.seedCandleCount || DEFAULT_SEED_COUNT)
  const [seedError, setSeedError] = useState(null)

  const toggleExecutionState = () => {
    if (!seedError) {
      if (isExecuting) {
        dsStopLiveStrategy(authToken)
      } else {
        dsExecuteLiveStrategy(authToken, symbol?.wsID, timeframe, trades, strategyContent, candleSeed, margin)
      }
    }
  }

  const updateSeed = (v) => {
    const error = AmountInput.validateValue(v)
    setSeedError(error)
    setCandleSeed(v)
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
        <div className='hfui-backtester__flex_start'>
          <Checkbox
            label={t('strategyEditor.useMarginCheckbox')}
            checked={margin}
            onChange={setMargin}
          />
        </div>
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
            def={{ label: 'Candle seed count' }}
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
    </div>
  )
}

LiveStrategyExecutor.propTypes = {
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
}

LiveStrategyExecutor.defaultProps = {
  strategyContent: {},
  markets: {},
}

export default memo(LiveStrategyExecutor)
