import React, { useState } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import { Checkbox, Truncate } from '@ufx-ui/core'
import timeFrames from '../../util/time_frames'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import DateInput from '../OrderForm/FieldComponents/input.date'
import TimeFrameDropdown from '../TimeFrameDropdown'
import Button from '../../ui/Button'

const MAX_DATE = new Date()

const BacktestOptionsPanel = ({
  timeframe,
  setTimeframe,
  trades,
  setTrades,
  // margin,
  candleSeed,
  setCandleSeed,
  setFullScreenChart,
  onBacktestStart,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  isFinished,
  candles,
  setCandles,
}) => {
  const [seedError, setSeedError] = useState(null)

  const { t } = useTranslation()

  const updateSeed = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    setSeedError(error)
    if (error) {
      return
    }
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
          value={candleSeed}
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
  timeframe: PropTypes.oneOf(timeFrames).isRequired,
  setTimeframe: PropTypes.func.isRequired,
  trades: PropTypes.bool.isRequired,
  setTrades: PropTypes.func.isRequired,
  // margin: PropTypes.bool.isRequired,
  candleSeed: PropTypes.number.isRequired,
  setCandleSeed: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
  setFullScreenChart: PropTypes.func.isRequired,
  onBacktestStart: PropTypes.func,
  isFinished: PropTypes.bool.isRequired,
  candles: PropTypes.bool.isRequired,
  setCandles: PropTypes.func.isRequired,
  startDate: PropTypes.instanceOf(Date).isRequired,
  endDate: PropTypes.instanceOf(Date).isRequired,
  setStartDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
}

BacktestOptionsPanel.defaultProps = {
  onBacktestStart: () => {},
}

export default BacktestOptionsPanel
