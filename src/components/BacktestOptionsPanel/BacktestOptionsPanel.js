import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import {
  Checkbox, Button, Spinner, Intent,
} from '@ufx-ui/core'
import cx from 'clsx'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import DateInput from '../OrderForm/FieldComponents/input.date'
import TimeFrameDropdown from '../TimeFrameDropdown'
import Dropdown from '../../ui/Dropdown'
import { STRATEGY_OPTIONS_KEYS } from '../StrategyEditor/StrategyEditor.helpers'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const MAX_DATE = new Date()

const getTimePeriods = (t) => ([
  { value: '1d', label: t('strategyEditor.lastXday', { amount: 1 }) },
  { value: '7d', label: t('strategyEditor.lastXdays', { amount: 7 }) },
  { value: '30d', label: t('strategyEditor.lastXdays', { amount: 30 }) },
  { value: '90d', label: t('strategyEditor.lastXdays', { amount: 90 }) },
  { value: '180d', label: t('strategyEditor.lastXdays', { amount: 180 }) },
  { value: '365d', label: t('strategyEditor.lastXdays', { amount: 365 }) },
])

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
  const { t } = useTranslation()
  const [seedError, setSeedError] = useState(null)
  const [candleSeedValue, setCandleSeedValue] = useState(candleSeed)
  const [isCustomDatePicker, setIsCustomDatePicker] = useState(false)
  const timePeriods = getTimePeriods(t)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startDate = new Date(_startDate)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const endDate = new Date(_endDate)

  const setTimeframe = (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: value })

  // create a 'timePeriod' variable which converts startDate and endDate into a string like 'Last 7 days' or 'Last 1 month', etc.
  const timePeriod = useMemo(() => {
    const diff = endDate.getTime() - startDate.getTime()
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) {
      return '1d'
    }

    if (diffDays <= 7) {
      return '7d'
    }

    if (diffDays <= 30) {
      return '30d'
    }

    if (diffDays <= 90) {
      return '90d'
    }

    if (diffDays <= 180) {
      return '180d'
    }

    return '365d'
  }, [startDate, endDate])

  const setTimePeriod = (value) => {
    const end = new Date()
    const start = new Date()

    switch (value) {
      case '1d':
        start.setDate(start.getDate() - 1)
        break
      case '7d':
        start.setDate(end.getDate() - 7)
        break
      case '30d':
        start.setDate(end.getDate() - 30)
        break
      case '90d':
        start.setDate(end.getDate() - 90)
        break
      case '180d':
        start.setDate(end.getDate() - 180)
        break
      case '365d':
        start.setDate(end.getDate() - 365)
        break
      default:
        break
    }

    saveStrategyOptions({
      [STRATEGY_OPTIONS_KEYS.START_DATE]: start,
      [STRATEGY_OPTIONS_KEYS.END_DATE]: end,
    })
  }

  // https://kyleshevlin.com/debounce-and-throttle-callbacks-with-react-hooks
  const setCandleSeed = useMemo(
    () => _debounce(
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
        <div className='hfui-strategy-backtest-options__icn-selector-container'>
          <Icon
            name='clock-o'
            className={cx('icon-selector', {
              active: !isCustomDatePicker,
            })}
            title={t('strategyEditor.switchToRegular')}
            onClick={() => setIsCustomDatePicker(false)}
          />
          <Icon
            name='calendar'
            className={cx('icon-selector', {
              active: isCustomDatePicker,
            })}
            title={t('strategyEditor.switchToCustom')}
            onClick={() => setIsCustomDatePicker(true)}
          />
        </div>
      </div>
      {isCustomDatePicker ? (
        <>
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
        </>
      ) : (
        <div className='item'>
          <Dropdown
            disabled={isLoading}
            value={timePeriod}
            onChange={setTimePeriod}
            options={timePeriods}
            placeholder={t('strategyEditor.timePeriod')}
          />
          <p
            className={cx('hfui-orderform__input-label', {
              disabled: isLoading,
            })}
          >
            {t('strategyEditor.timePeriod')}
          </p>
        </div>
      )}
      <div className='item'>
        <Checkbox
          label={t('strategyEditor.useCandlesCheckbox')}
          checked={candles}
          onChange={setCandles}
          disabled={isLoading}
        />
        <div
          className={cx('hfui-orderform__input-label', {
            disabled: isLoading,
          })}
        >
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
            <p
              className={cx('hfui-orderform__input-label', {
                disabled: isLoading,
              })}
            >
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
        <div
          className={cx('hfui-orderform__input-label', {
            disabled: isLoading,
          })}
        >
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
            className='hfui-strategy-backtest-options__calculating-btn'
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
  onBacktestStart: () => { },
}

export default BacktestOptionsPanel
