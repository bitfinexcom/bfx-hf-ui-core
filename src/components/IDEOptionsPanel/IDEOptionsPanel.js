import { Tooltip } from '@ufx-ui/core'
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import { makeShorterLongName } from '../../util/ui'
import Button from '../../ui/Button'

const MAX_STRATEGY_LABEL_LENGTH = 25

const IDEOptionsPanel = ({
  onOpenSaveStrategyAsModal,
  strategy,
  strategyDirty,
  hasErrors,
  onSaveStrategy,
}) => {
  const { label } = strategy || {}

  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-options hfui-strategy-options--ide'>
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
      <div className='hfui-strategy-options__right-container'>
        <p className='message'>
          {hasErrors && t('strategyEditor.errorsInIDE')}
          {strategyDirty && !hasErrors && t('strategyEditor.unsavedChanges')}
          {!hasErrors && !strategyDirty && t('strategyEditor.saved')}
        </p>
        <Button
          green
          className='hfui-strategy-options__option-btn'
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

IDEOptionsPanel.propTypes = {
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
}

export default memo(IDEOptionsPanel)
