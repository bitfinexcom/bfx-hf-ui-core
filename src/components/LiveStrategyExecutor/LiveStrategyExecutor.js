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

const LiveStrategyExecutor = ({
  strategyContent, markets, dsExecuteLiveStrategy, dsStopLiveStrategy, isExecuting, authToken,
}) => {
  const { t } = useTranslation()
  const [timeframe, setTimeframe] = useState('1m')
  const [symbol, setSymbol] = useState(getDefaultMarket(markets))
  const [trades, setTrades] = useState(false)
  const [candleSeed, setCandleSeed] = useState(150)
  const [seedError, setSeedError] = useState(null)

  const toggleExecutionState = () => {
    if (isExecuting) {
      dsStopLiveStrategy(authToken)
    } else {
      dsExecuteLiveStrategy(authToken, symbol, timeframe, trades, strategyContent)
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
        <p>Create a strategy to begin executing.</p>
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
              const sel = _find(markets, m => m.uiID === selection.uiID)
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
            green={!isExecuting}
          />
        </div>
      </div>
      <div className='hfui-backtester_row'>
        <div className='hfui-backtester__flex_start'>
          <AmountInput
            def={{ label: 'Candle seed count' }}
            validationError={seedError}
            value={candleSeed}
            onChange={updateSeed}
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
      <p>NOTE: By pressing start, you will be executing your strategy on your live account with real balances.</p>
    </div>
  )
}

LiveStrategyExecutor.propTypes = {
  dsExecuteLiveStrategy: PropTypes.func.isRequired,
  dsStopLiveStrategy: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  isExecuting: PropTypes.bool.isRequired,
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
