import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import MarketSelect from '../MarketSelect'
import Button from '../../ui/Button'
import StrategyRunned from '../StrategyEditor/components/StrategyRunned'
import StrategyStopped from '../StrategyEditor/components/StrategyStopped'
import StrategyTypeSelect from './StrategyTypeSelect'
import StrategyOptionsButton from './StrategyOptionsButton'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanelLive = ({
  strategy,
  markets,
  isExecuting,
  hasResults,
  openExecutionOptionsModal,
  setFullScreenChart,
  stopExecution,
  saveStrategyOptions,
}) => {
  const { label, strategyOptions: { symbol, strategyType } = {} } = strategy || {}
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-options'>
      <div className='hfui-strategy-options__left-container'>
        <p
          className='hfui-strategy-options__strategy-name item'
        >
          <>
            {_size(label) > MAX_STRATEGY_LABEL_LENGTH ? (
              <Tooltip
                className='__react-tooltip __react_component_tooltip wide'
                content={label}
              >
                {label}
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
            markets={markets}
            onChange={() => {}}
            disabled
            renderWithFavorites
          />
          <p className='hfui-orderform__input-label'>
            {t('strategyEditor.selectMarketDescriptionDisabled')}
          </p>
        </div>
        <StrategyTypeSelect
          saveStrategyOptions={saveStrategyOptions}
          strategyType={strategyType}
          isExecuting={isExecuting}
          isDisabled
        />
        <StrategyOptionsButton onClick={openExecutionOptionsModal} />
      </div>
      <div className='hfui-strategy-options__buttons-container'>
        {hasResults && (
          <Button
            className='hfui-strategy-options__option-btn item'
            label={t('strategyEditor.fullscreenChartBtn')}
            onClick={setFullScreenChart}
            green
          />
        )}
        {isExecuting && (
          <Button
            className='hfui-strategy-options__option-btn item'
            label={t('ui.stopBtn')}
            onClick={stopExecution}
            red
          />
        )}
      </div>
    </div>
  )
}

StrategyOptionsPanelLive.propTypes = {
  markets: PropTypes.arrayOf(Object).isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
    strategyOptions: PropTypes.shape({
      symbol: PropTypes.objectOf(
        PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.arrayOf(PropTypes.string),
          PropTypes.bool,
          PropTypes.number,
        ]),
      ).isRequired,
      strategyType: PropTypes.shape({
        i18nKey: PropTypes.string,
        customValue: PropTypes.string,
      }),
    }),
  }).isRequired,
  isExecuting: PropTypes.bool.isRequired,
  hasResults: PropTypes.bool.isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
  openExecutionOptionsModal: PropTypes.func.isRequired,
  setFullScreenChart: PropTypes.func.isRequired,
  stopExecution: PropTypes.func.isRequired,
}

export default memo(StrategyOptionsPanelLive)
