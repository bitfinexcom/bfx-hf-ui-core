import React from 'react'
import PropTypes from 'prop-types'
import _find from 'lodash/find'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import _includes from 'lodash/includes'
import { useTranslation } from 'react-i18next'

import { Icon } from 'react-fa'
import MarketSelect from '../MarketSelect'
import Button from '../../ui/Button'
import { makeShorterLongName } from '../../util/ui'
import StrategyRunned from '../StrategyEditor/components/StrategyRunned'
import StrategyStopped from '../StrategyEditor/components/StrategyStopped'
import StrategyTypeSelect from './StrategyTypeSelect'
import NavbarButton from '../Navbar/Navbar.Button'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanelSandbox = ({
  strategy,
  onOpenSaveStrategyAsModal,
  symbol,
  markets,
  setMargin,
  setSymbol,
  isExecuting,
  hasResults,
  onSaveAsStrategy,
  openExecutionOptionsModal,
  strategyDirty,
  hasErrors,
  onSaveStrategy,
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
        <NavbarButton
          alt='Application settings'
          icon='settings-icon'
          className='hfui-navbar__app-settings__icon item'
          onClick={openExecutionOptionsModal}
        />
      </div>
      <div className='hfui-strategy-options__save-container'>
        <p className='message'>
          {hasErrors && t('strategyEditor.errorsInIDE')}
          {strategyDirty && !hasErrors && t('strategyEditor.unsavedChanges')}
          {!hasErrors && !strategyDirty && t('strategyEditor.saved')}
        </p>
        <Button
          green
          className='save-btn'
          label={[
            <Icon key='icon' name='floppy-o' />,
            <span key='text'>{t('ui.save')}</span>,
          ]}
          onClick={onSaveStrategy}
          disabled={hasErrors || !strategyDirty}
        />
      </div>

    </div>
  )
}

StrategyOptionsPanelSandbox.propTypes = {
  markets: PropTypes.objectOf(PropTypes.object).isRequired, // eslint-disable-line
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
  isExecuting: PropTypes.bool.isRequired,
  hasResults: PropTypes.bool.isRequired,
  onSaveAsStrategy: PropTypes.func.isRequired,
  openExecutionOptionsModal: PropTypes.func.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
}

export default StrategyOptionsPanelSandbox
