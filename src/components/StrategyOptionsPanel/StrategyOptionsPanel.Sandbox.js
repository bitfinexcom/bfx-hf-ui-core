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
import StrategyTypeSelect from './StrategyTypeSelect'
import NavbarButton from '../Navbar/Navbar.Button'
import { STRATEGY_OPTIONS_KEYS } from '../StrategyEditor/StrategyEditor.helpers'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanelSandbox = ({
  strategy,
  onOpenSaveStrategyAsModal,
  markets,
  openExecutionOptionsModal,
  strategyDirty,
  hasErrors,
  onSaveStrategy,
  saveStrategyOptions,
}) => {
  const {
    label,
    strategyOptions: { symbol, strategyType } = {},
  } = strategy || {}
  const { t } = useTranslation()

  const onMarketSelectChange = (selection) => {
    const sel = _find(markets, (m) => m.wsID === selection.wsID)
    const options = {
      [STRATEGY_OPTIONS_KEYS.SYMBOL]: sel,
    }

    if (!_includes(sel?.contexts, 'm')) {
      options[STRATEGY_OPTIONS_KEYS.MARGIN] = false
    }
    saveStrategyOptions(options)
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
        <div className='hfui-strategy-options__input item'>
          <MarketSelect
            value={symbol}
            onChange={onMarketSelectChange}
            markets={markets}
            renderWithFavorites
          />
          <p className='hfui-orderform__input-label'>
            {t('strategyEditor.selectMarketDescription')}
          </p>
        </div>
        <StrategyTypeSelect
          saveStrategyOptions={saveStrategyOptions}
          strategyType={strategyType}
          isExecuting={false}
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
  saveStrategyOptions: PropTypes.func.isRequired,
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
    }).isRequired,
  }).isRequired,
  openExecutionOptionsModal: PropTypes.func.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
}

export default StrategyOptionsPanelSandbox
