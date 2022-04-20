import React, { useState } from 'react'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _size from 'lodash/size'
import { Tooltip, Checkbox, Truncate } from '@ufx-ui/core'

import _includes from 'lodash/includes'
import { useTranslation } from 'react-i18next'
import timeFrames from '../../util/time_frames'

import TimeFrameDropdown from '../TimeFrameDropdown'
import AmountInput from '../OrderForm/FieldComponents/input.amount'
import MarketSelect from '../MarketSelect'
import Button from '../../ui/Button'
import { makeShorterLongName } from '../../util/ui'

import './style.scss'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanel = ({
  strategy,
  strategyDirty,
  onOpenSaveStrategyAsModal,
  symbol,
  markets,
  setMargin,
  setSymbol,
  isPaperTrading,
  timeframe,
  setTimeframe,
  trades,
  setTrades,
  margin,
  candleSeed,
  setCandleSeed,
}) => {
  const [seedError, setSeedError] = useState(null)

  const { t } = useTranslation()

  const updateSeed = (v) => {
    const error = AmountInput.validateValue(v, t)
    const processed = AmountInput.processValue(v)

    setSeedError(error)
    setCandleSeed(processed)
  }

  const { label: strategyName } = strategy || {}
  const strategyDisplayName = strategyDirty
    ? t('strategyEditor.unsavedStartegy')
    : strategyName

  return (
    <div className='hfui-strategy-options'>
      <p
        className='hfui-strategy-options__strategy-name item'
        onClick={onOpenSaveStrategyAsModal}
      >
        <>
          {_size(strategyDisplayName) > MAX_STRATEGY_LABEL_LENGTH ? (
            <Tooltip
              className='__react-tooltip __react_component_tooltip wide'
              content={strategyDisplayName}
            >
              {makeShorterLongName(
                strategyDisplayName,
                MAX_STRATEGY_LABEL_LENGTH,
              )}
            </Tooltip>
          ) : (
            strategyDisplayName
          )}
        </>
      </p>
      <div className='hfui-strategy-options__input item'>
        <MarketSelect
          value={symbol}
          onChange={(selection) => {
            const sel = _find(markets, (m) => m.wsID === selection.wsID)
            if (!_includes(sel?.contexts, 'm')) {
              setMargin(false)
            }
            setSymbol(sel)
          }}
          markets={markets}
          renderWithFavorites
        />
        <p className='hfui-orderform__input-label'>{t('strategyEditor.selectMarketDescription')}</p>
      </div>
      <div className='hfui-strategy-options__input item'>
        <TimeFrameDropdown tf={timeframe} onChange={setTimeframe} />
        <p className='hfui-orderform__input-label'>{t('strategyEditor.selectCandleDurationDescription')}</p>
      </div>
      <AmountInput
        className='hfui-strategy-options__amount-input item'
        def={{ label: t('strategyEditor.candleSeedCount') }}
        validationError={seedError}
        value={candleSeed}
        onChange={updateSeed}
      />
      {!isPaperTrading && _includes(symbol?.contexts, 'm') && (
        <div className='hfui-strategy-options__amount-input item'>
          <Checkbox
            label={t('strategyEditor.useMarginCheckbox')}
            checked={margin}
            onChange={setMargin}
          />
          <p className='hfui-orderform__input-label'>{t('strategyEditor.useMarginCheckboxDescription')}</p>
        </div>
      )}
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
      <Button
        className='hfui-strategy-options__fullscreen-btn item'
        label={t('strategyEditor.fullscreenChartBtn')}
        onClick={() => {}}
        green
      />
    </div>
  )
}

StrategyOptionsPanel.propTypes = {
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  timeframe: PropTypes.oneOf(timeFrames).isRequired,
  setTimeframe: PropTypes.func.isRequired,
  symbol: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.bool,
      PropTypes.number,
    ]),
  ).isRequired,
  setSymbol: PropTypes.func.isRequired,
  trades: PropTypes.bool.isRequired,
  setTrades: PropTypes.func.isRequired,
  margin: PropTypes.bool.isRequired,
  setMargin: PropTypes.func.isRequired,
  candleSeed: PropTypes.number.isRequired,
  setCandleSeed: PropTypes.func.isRequired,
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
}

export default StrategyOptionsPanel
