import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import { Icon } from 'react-fa'
import clsx from 'clsx'
import Button from '../../ui/Button'
import StrategyTypeSelect from './StrategyTypeSelect'
import { MARKET_SHAPE, STRATEGY_SHAPE } from '../../constants/prop-types-shapes'
import StrategyMarketSelect from './StrategyMarketSelect'

import './style.css'

const MAX_STRATEGY_LABEL_LENGTH = 25

const StrategyOptionsPanelSandbox = ({
  strategy,
  onOpenEditStrategyLabelModal,
  markets,
  strategyDirty,
  hasErrors,
  onSaveStrategy,
  saveStrategyOptions,
}) => {
  const {
    label,
    executionId,
    strategyOptions: { symbol, strategyType } = {},
  } = strategy || {}
  const { t } = useTranslation()

  const onStrategyNameClick = () => {
    if (executionId) {
      return
    }
    onOpenEditStrategyLabelModal()
  }

  return (
    <div className='hfui-strategy-options'>
      <div className='hfui-strategy-options__left-container'>
        <p
          className={clsx('hfui-strategy-options__strategy-name item', {
            edited: !executionId,
          })}
          onClick={onStrategyNameClick}
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
        <StrategyMarketSelect
          saveStrategyOptions={saveStrategyOptions}
          markets={markets}
          symbol={symbol}
        />
        <StrategyTypeSelect
          saveStrategyOptions={saveStrategyOptions}
          strategyType={strategyType}
          isExecuting={false}
        />
      </div>
      <div className='hfui-strategy-options__save-container'>
        <p className='saving-message'>
          {hasErrors && (
            <span className='red'>{t('strategyEditor.errorsInIDE')}</span>
          )}
          {strategyDirty && !hasErrors && (
            <span className='grey'>{t('strategyEditor.unsavedChanges')}</span>
          )}
          {!hasErrors && !strategyDirty && (
            <span className='green'>{t('strategyEditor.saved')}</span>
          )}
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
  markets: PropTypes.arrayOf(PropTypes.shape(MARKET_SHAPE)).isRequired,
  saveStrategyOptions: PropTypes.func.isRequired,
  strategy: PropTypes.shape(STRATEGY_SHAPE).isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
  onOpenEditStrategyLabelModal: PropTypes.func.isRequired,
}

export default memo(StrategyOptionsPanelSandbox)
