import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
import { useTranslation } from 'react-i18next'
import {
  Checkbox, Button, Spinner, Intent,
} from '@ufx-ui/core'
import cx from 'clsx'
import AmountInput from '../../OrderForm/FieldComponents/input.amount'
import DatePicker from '../../../ui/DatePicker/DatePicker'
import TimeFrameDropdown from '../../TimeFrameDropdown'
import Dropdown from '../../../ui/Dropdown'
import { STRATEGY_OPTIONS_KEYS } from '../../StrategyEditor/StrategyEditor.helpers'
import { STRATEGY_SHAPE } from '../../../constants/prop-types-shapes'
import ClockIcon from '../../../ui/Icons/ClockIcon'
import CalendarIcon from '../../../ui/Icons/CalendarIcon'

const MAX_DATE = new Date()

const TIME_MAPPING = {
  '168h': 168,
  '720h': 720,
  '2160h': 2160,
  '8640h': 8640,
  '25920h': 25920,
}

const getTimePeriods = (t) => ([
  { value: '168h', label: t('strategyEditor.lastWeek') },
  { value: '720h', label: t('strategyEditor.lastMonth') },
  { value: '2160h', label: t('strategyEditor.lastQuarter') },
  { value: '8640h', label: t('strategyEditor.lastYear') },
  { value: '25920h', label: t('strategyEditor.lastXyears', { amount: 3 }) },
])

const BacktestOptionsNewTest = ({
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
  const [isCustomDatePicker, setIsCustomDatePicker] = useState(true)
  const [timePeriodDropdownValue, setTimePeriodDropdownValue] = useState(null)
  const timePeriods = getTimePeriods(t)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const startDate = new Date(_startDate)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const endDate = new Date(_endDate)

  const setTimeframe = (value) => saveStrategyOptions({ [STRATEGY_OPTIONS_KEYS.TIMEFRAME]: value })

  const setTimePeriod = (value) => {
    const end = new Date()
    const start = new Date()
    const hours = TIME_MAPPING[value]
    start.setHours(start.getHours() - hours)
    setTimePeriodDropdownValue(value)
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
    <>
      <div className='item'>
        <div className='hfui-strategy-backtest-options__icn-selector-container'>
          <ClockIcon
            className={cx('icon-selector', {
              active: !isCustomDatePicker,
            })}
            title={t('strategyEditor.switchToRegular')}
            onClick={() => setIsCustomDatePicker(false)}
          />
          <CalendarIcon
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
            <DatePicker
              onChange={setStartDate}
              label={t('strategyEditor.startDate')}
              value={startDate}
              maxDate={endDate}
              disabled={isLoading}
            />
          </div>
          <div className='item'>
            <DatePicker
              onChange={setEndDate}
              label={t('strategyEditor.endDate')}
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
            value={timePeriodDropdownValue}
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
        <div className='button-container'>
          <Button
            intent={Intent.NONE}
            onClick={onCancelProcess}
            className='hfui-strategy-backtest-options__start-btn'
          >
            {t('strategyEditor.cancelThisProcess')}
          </Button>
        </div>
      )}
      <div className='button-container'>
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
    </>
  )
}

BacktestOptionsNewTest.propTypes = {
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  onCancelProcess: PropTypes.func.isRequired,
  onBacktestStart: PropTypes.func,
  isLoading: PropTypes.bool.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
}

BacktestOptionsNewTest.defaultProps = {
  onBacktestStart: () => { },
}

export default BacktestOptionsNewTest
