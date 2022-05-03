import React, { memo } from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'

const Item = ({
  isSelected, isDisabled, children, onClick, ...props // eslint-disable-line
}) => (
  <div
    className={cx('hfui-orderform__ao-settings__item is-layout', {
      'is-selected': isSelected,
      'is-disabled': isDisabled,
    })}
    onClick={isDisabled ? () => {} : onClick}
    {...props}
  >
    {children}
  </div>
)

const StrategyParams = ({
  startExecution,
  stopExecution,
  onLoadStrategy,
  onExportStrategy,
  onSaveStrategy,
  executing,
  onOpenRemoveModal,
  strategy,
  strategyId,
  onOpenCreateStrategyModal,
  onOpenCreateStrategyFromModal,
  onOpenSaveStrategyAsModal,
  onImportStrategy,
  closeParams,
}) => {
  const { id = strategyId } = strategy || {}
  const { t } = useTranslation()

  const onClose = () => {
    onLoadStrategy({})
  }

  return (
    <div className='hfui-orderform__ao-settings'>
      <div className='hfui-orderform__ao-settings__menu hfui-strategy__options-panel'>
        <div className='hfui-orderform__ao-settings__menu-buttons' onClick={closeParams}>
          <Item onClick={startExecution} isDisabled={executing}>
            <Icon name='play' />
                &nbsp;&nbsp;
            {t('strategyEditor.launchStrategy')}
          </Item>
          <Item onClick={stopExecution} isDisabled={!executing}>
            <Icon name='stop' />
                &nbsp;&nbsp;
            {t('strategyEditor.stopExec')}
          </Item>
          <div className='hfui-navbar__layout-settings__separator' />
          <Item onClick={onOpenCreateStrategyModal}>
            {t('strategyEditor.newStrategy2')}
          </Item>
          <Item onClick={onOpenCreateStrategyFromModal}>
            {t('strategyEditor.newStrategyFrom2')}
          </Item>
          <Item onClick={onImportStrategy}>
            {t('strategyEditor.importStrategy')}
          </Item>
          <Item onClick={onSaveStrategy}>
            {t('ui.save')}
          </Item>
          <Item onClick={onOpenSaveStrategyAsModal}>
            {t('ui.saveAs')}
          </Item>
          <Item onClick={onExportStrategy}>
            {t('strategyEditor.exportStrategy')}
          </Item>
          <Item onClick={onOpenRemoveModal} isDisabled={!id}>
            {t('ui.removeBtn')}
          </Item>
          <Item onClick={onClose}>
            {t('strategyEditor.closeStrategy')}
          </Item>
        </div>
      </div>
    </div>
  )
}

StrategyParams.propTypes = {
  startExecution: PropTypes.func.isRequired,
  stopExecution: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  onExportStrategy: PropTypes.func.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
  executing: PropTypes.bool.isRequired,
  onOpenRemoveModal: PropTypes.func.isRequired,
  onImportStrategy: PropTypes.func.isRequired,
  onOpenCreateStrategyModal: PropTypes.func.isRequired,
  onOpenCreateStrategyFromModal: PropTypes.func.isRequired,
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    id: PropTypes.string,
  }),
  strategyId: PropTypes.string,
  closeParams: PropTypes.func.isRequired,
}

StrategyParams.defaultProps = {
  strategyId: '',
  strategy: {
    id: null,
  },
}

export default memo(StrategyParams)
