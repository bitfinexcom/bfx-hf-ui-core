import React from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import MarketSelect from '../MarketSelect'
import Button from '../../ui/Button'
import { makeShorterLongName } from '../../util/ui'
import StrategyRunned from '../StrategyEditor/components/StrategyRunned'
import StrategyStopped from '../StrategyEditor/components/StrategyStopped'
import StrategyTypeSelect from './StrategyTypeSelect'
import NavbarButton from '../Navbar/Navbar.Button'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanelLive = ({
  strategy,
  onOpenSaveStrategyAsModal,
  markets,
  isExecuting,
  hasResults,
  openExecutionOptionsModal,
  setFullScreenChart,
  stopExecution,
  startExecution,
  saveStrategyOptions,
}) => {
  const {
    label,
    strategyOptions: { symbol, strategyType } = {},
  } = strategy || {}
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-options'>
      <div className='hfui-strategy-options__left-container'>
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
        <NavbarButton
          alt='Application settings'
          icon='settings-icon'
          className='hfui-navbar__app-settings__icon item'
          onClick={openExecutionOptionsModal}
        />
      </div>
      <div className='hfui-strategy-options__buttons-container'>
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
    </div>
  )
}

StrategyOptionsPanelLive.propTypes = {
  markets: PropTypes.objectOf(PropTypes.object).isRequired, // eslint-disable-line
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
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
  startExecution: PropTypes.func.isRequired,
}

export default StrategyOptionsPanelLive
