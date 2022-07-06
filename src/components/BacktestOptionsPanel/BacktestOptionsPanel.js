import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
import { useTranslation } from 'react-i18next'
import {
  Checkbox, Button, Spinner, Intent,
} from '@ufx-ui/core'
import clsx from 'clsx'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import DateInput from '../OrderForm/FieldComponents/input.date'
import TimeFrameDropdown from '../TimeFrameDropdown'
import { STRATEGY_OPTIONS_KEYS } from '../StrategyEditor/StrategyEditor.helpers'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const MAX_DATE = new Date()

const BacktestOptionsPanel = ({
  onBacktestStart,
  strategy,
  saveStrategyOptions,
  isLoading,
  onCancelProcess,
}) => {
  const {
    strategyOptions: {
      timeframe,
      trades,
      candleSeed,
      startDate: _startDate,
      endDate: _endDate,
      candles,
    },
  } = strategy
  const [seedError, setSeedError] = useState(null)
  const [candleSeedValue, setCandleSeedValue] = useState(candleSeed)

  const startDate = new Date(_startDate)
  const endDate = new Date(_endDate)

  const { t } = useTranslation()

  const setTimeframe = (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: value })
  const setCandleSeed = useCallback(
    _debounce(
      (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.CANDLE_SEED]: value }),
      1000,
    ),
    [saveStrategyOptions],
  )
  const setStartDate = (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.START_DATE]: value })
  const setEndDate = (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.END_DATE]: value })
  const setTrades = (value) => saveStrategyOptions({
    [STRATEGY_OPTIONS_KEYS.TRADES]: value,
    [STRATEGY_OPTIONS_KEYS.CANDLES]: !value,
  })
  const setCandles = (value) => saveStrategyOptions({
    [STRATEGY_OPTIONS_KEYS.CANDLES]: value,
    [STRATEGY_OPTIONS_KEYS.TRADES]: !value,
  })

  const updateSeed = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    setSeedError(error)
    if (error) {
      return
    }
    setCandleSeedValue(processed)
    setCandleSeed(processed)
  }

  return (
    <div className='hfui-strategy-backtest-options'>
      <div className='item'>
        <DateInput
          onChange={setStartDate}
          def={{ label: t('strategyEditor.startDate') }}
          value={startDate}
          maxDate={endDate}
          disabled={isLoading}
        />
      </div>
      <div className='item'>
        <DateInput
          onChange={setEndDate}
          def={{ label: t('strategyEditor.endDate') }}
          value={endDate}
          maxDate={MAX_DATE}
          minDate={startDate}
          disabled={isLoading}
        />
      </div>
      <div className='item'>
        <Checkbox
          label={t('strategyEditor.useCandlesCheckbox')}
          checked={candles}
          onChange={setCandles}
          disabled={isLoading}
        />
        <div className={clsx('hfui-orderform__input-label', { disabled: isLoading })}>
          {t('strategyEditor.useCandlesCheckboxDescription')}
        </div>
      </div>
      {candles && (
      <>
        <div className='item'>
          <TimeFrameDropdown
            disabled={isLoading}
            tf={timeframe}
            onChange={setTimeframe}
          />
          <p className={clsx('hfui-orderform__input-label', { disabled: isLoading })}>
            {t('strategyEditor.selectCandleDurationDescription')}
          </p>
        </div>
        <AmountInput
          className='item'
          def={{ label: t('strategyEditor.candleSeedCount') }}
          validationError={seedError}
          value={candleSeedValue}
          onChange={updateSeed}
          disabled={isLoading}
        />
      </>
      )}
      {/* {!isPaperTrading && _includes(symbol?.contexts, 'm') && (
        <div className='hfui-strategy-options__amount-input item'>
          <Checkbox
            label={t('strategyEditor.useMarginCheckbox')}
            checked={margin}
            onChange={setMargin}
          />
          <p className='hfui-orderform__input-label'>{t('strategyEditor.useMarginCheckboxDescription')}</p>
        </div>
      )} */}
      <div className='item'>
        <Checkbox
          label={t('strategyEditor.useTradesCheckbox')}
          checked={trades}
          onChange={setTrades}
          disabled={isLoading}
        />
        <div className={clsx('hfui-orderform__input-label', { disabled: isLoading })}>
          {t('strategyEditor.useTradesCheckboxDescription')}
        </div>
      </div>

      {isLoading && (
      <div className='item'>
        <Button
          intent={Intent.NONE}
          onClick={onCancelProcess}
          className='hfui-strategy-backtest-options__start-btn'
        >
          {t('strategyEditor.cancelThisProcess')}
        </Button>

      </div>
      )}
      <div className='item'>
        {isLoading ? (
          <Button
            className='hfui-strategy-backtest-options__start-btn'
            intent={Intent.INFO}
            disabled
          >
            <Spinner className='hfui-strategy-backtest-options__spinner' />
            {t('strategyEditor.calculating')}
          </Button>
        ) : (
          <Button
            className='hfui-strategy-backtest-options__start-btn'
            onClick={onBacktestStart}
            intent={Intent.PRIMARY}
          >
            {t('ui.startBtn')}
          </Button>
        )}
      </div>
    </div>
  )
}

BacktestOptionsPanel.propTypes = {
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  onCancelProcess: PropTypes.func.isRequired,
  onBacktestStart: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
}

BacktestOptionsPanel.defaultProps = {
  onBacktestStart: () => {},
}

export default BacktestOptionsPanel
