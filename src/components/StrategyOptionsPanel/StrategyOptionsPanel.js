import React from 'react'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import _includes from 'lodash/includes'
import { useTranslation } from 'react-i18next'

import MarketSelect from '../MarketSelect'
import Button from '../../ui/Button'
import { makeShorterLongName } from '../../util/ui'
import StrategyRunned from '../StrategyEditor/components/StrategyRunned'
import StrategyStopped from '../StrategyEditor/components/StrategyStopped'
import StrategyTypeSelect from './StrategyTypeSelect'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanel = ({
  strategy,
  onOpenSaveStrategyAsModal,
  symbol,
  markets,
  setMargin,
  setSymbol,
  setFullScreenChart,
  startExecution,
  isExecuting,
  hasResults,
  stopExecution,
  onSaveAsStrategy,
}) => {
  const { label } = strategy || {}
  const { t } = useTranslation()

  const onMarketSelectChange = (selection) => {
    const sel = _find(markets, (m) => m.wsID === selection.wsID)
    if (!_includes(sel?.contexts, 'm')) {
      setMargin(false)
    }
    setSymbol(sel)
  }

  return (
    <div className='hfui-strategy-options'>
      <p
        className='hfui-strategy-options__strategy-name item'
        onClick={onOpenSaveStrategyAsModal}
      >
        <>
          {_size(label) > MAX_STRATEGY_LABEL_LENGTH ? (
            <Tooltip
              className='__react-tooltip __react_component_tooltip wide'
              content={label}
            >
              {makeShorterLongName(label, MAX_STRATEGY_LABEL_LENGTH)}
            </Tooltip>
          ) : (
            label
          )}
        </>
      </p>
      {isExecuting && (
        <div className='hfui-strategy-options__option item'>
          <StrategyRunned />
        </div>
      )}
      {!isExecuting && hasResults && (
        <div className='hfui-strategy-options__option item'>
          <StrategyStopped />
        </div>
      )}
      <div className='hfui-strategy-options__input item'>
        <MarketSelect
          value={symbol}
          onChange={onMarketSelectChange}
          markets={markets}
          disabled={isExecuting}
          renderWithFavorites
        />
        <p className='hfui-orderform__input-label'>
          {isExecuting
            ? t('strategyEditor.selectMarketDescriptionDisabled')
            : t('strategyEditor.selectMarketDescription')}
        </p>
      </div>
      <StrategyTypeSelect
        onSaveAsStrategy={onSaveAsStrategy}
        strategy={strategy}
        isExecuting={isExecuting}
      />
      {isExecuting ? (
        <>
          <Button
            className='hfui-strategy-options__option-btn item'
            label={t('strategyEditor.fullscreenChartBtn')}
            onClick={setFullScreenChart}
            green
          />
          <Button
            className='hfui-strategy-options__option-btn item'
            label={t('ui.stopBtn')}
            onClick={stopExecution}
            red
          />
        </>
      ) : (
        <Button
          className='hfui-strategy-options__option-btn item'
          label={t('ui.startBtn')}
          onClick={startExecution}
          green
        />
      )}
    </div>
  )
}

StrategyOptionsPanel.propTypes = {
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
  symbol: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.arrayOf(PropTypes.string),
      PropTypes.bool,
      PropTypes.number,
    ]),
  ).isRequired,
  setSymbol: PropTypes.func.isRequired,
  setMargin: PropTypes.func.isRequired,
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
  setFullScreenChart: PropTypes.func.isRequired,
  startExecution: PropTypes.func.isRequired,
  isExecuting: PropTypes.bool.isRequired,
  hasResults: PropTypes.bool.isRequired,
  stopExecution: PropTypes.bool.isRequired,
  onSaveAsStrategy: PropTypes.func.isRequired,
}

export default StrategyOptionsPanel
