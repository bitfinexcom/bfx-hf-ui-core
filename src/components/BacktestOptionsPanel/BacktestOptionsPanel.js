import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import _debounce from 'lodash/debounce'
import { useTranslation } from 'react-i18next'
import { Checkbox, Truncate } from '@ufx-ui/core'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import DateInput from '../OrderForm/FieldComponents/input.date'
import TimeFrameDropdown from '../TimeFrameDropdown'
import Button from '../../ui/Button'
import { STRATEGY_OPTIONS_KEYS } from '../StrategyEditor/StrategyEditor.helpers'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'

const MAX_DATE = new Date()

const BacktestOptionsPanel = ({
  // margin,
  setFullScreenChart,
  onBacktestStart,
  isFinished,
  strategy,
  saveStrategyOptions,
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
    <div className='hfui-strategy-options hfui-strategy-options'>
      <div className='hfui-strategy-options__amount-input item'>
        <Checkbox
          label={t('strategyEditor.useCandlesCheckbox')}
          checked={candles}
          onChange={setCandles}
        />
        <div className='hfui-orderform__input-label'>
          <Truncate>
            {t('strategyEditor.useCandlesCheckboxDescription')}
          </Truncate>
        </div>
      </div>
      {candles && (
        <>
          <div className='hfui-strategy-options__input item'>
            <TimeFrameDropdown tf={timeframe} onChange={setTimeframe} />
            <p className='hfui-orderform__input-label'>
              {t('strategyEditor.selectCandleDurationDescription')}
            </p>
          </div>
          <AmountInput
            className='hfui-strategy-options__amount-input item'
            def={{ label: t('strategyEditor.candleSeedCount') }}
            validationError={seedError}
            value={candleSeedValue}
            onChange={updateSeed}
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
      <div className='hfui-strategy-options__amount-input item'>
        <Checkbox
          label={t('strategyEditor.useTradesCheckbox')}
          checked={trades}
          onChange={setTrades}
        />
        <div className='hfui-orderform__input-label'>
          <Truncate>
            {t('strategyEditor.useTradesCheckboxDescription')}
          </Truncate>
        </div>
      </div>
      <div className='hfui-strategy-options__input item'>
        <DateInput
          onChange={setStartDate}
          def={{ label: t('strategyEditor.startDate') }}
          value={startDate}
          maxDate={endDate}
        />
      </div>
      <div className='hfui-strategy-options__input item'>
        <DateInput
          onChange={setEndDate}
          def={{ label: t('strategyEditor.endDate') }}
          value={endDate}
          maxDate={MAX_DATE}
          minDate={startDate}
        />
      </div>
      <div className='hfui-strategy-options__buttons-container item'>
        {isFinished && (
          <Button
            className='hfui-strategy-options__option-btn item'
            label={t('strategyEditor.fullscreenChartBtn')}
            onClick={setFullScreenChart}
            green
          />
        )}
        <Button
          className='hfui-strategy-options__option-btn item'
          label={t('ui.startBtn')}
          onClick={onBacktestStart}
          green
        />
      </div>
    </div>
  )
}

BacktestOptionsPanel.propTypes = {
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  setFullScreenChart: PropTypes.func.isRequired,
  onBacktestStart: PropTypes.func,
  isFinished: PropTypes.bool.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
}

BacktestOptionsPanel.defaultProps = {
  onBacktestStart: () => {},
}

export default BacktestOptionsPanel
