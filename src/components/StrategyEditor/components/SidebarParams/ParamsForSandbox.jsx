import React from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'
import SidebarParam from './SidebarParam'

const ParamsForSandbox = ({
  onClose,
  startExecution,
  isExecutionDisabled,
  onOpenCreateStrategyModal,
  onOpenCreateStrategyFromModal,
  onImportStrategy,
  onSaveStrategy,
  strategyDirty,
  onOpenSaveStrategyAsModal,
  onExportStrategy,
  onOpenRemoveModal,
  strategyId,
  executionId,
}) => {
  const { t } = useTranslation()

  const _startExecution = () => {
    startExecution(false)
  }

  return (
    <div className='hfui-orderform__ao-settings__menu-buttons'>
      <SidebarParam onClick={_startExecution} isDisabled={isExecutionDisabled}>
        <Icon name='play' />
        &nbsp;&nbsp;
        {t('strategyEditor.launchStrategy')}
      </SidebarParam>
      <div className='hfui-navbar__layout-settings__separator' />
      <SidebarParam onClick={onOpenCreateStrategyModal}>
        {t('strategyEditor.newStrategy2')}
      </SidebarParam>
      <SidebarParam onClick={onOpenCreateStrategyFromModal}>
        {t('strategyEditor.newStrategyFrom2')}
      </SidebarParam>
      <SidebarParam onClick={onImportStrategy}>
        {t('strategyEditor.importStrategy')}
      </SidebarParam>
      <SidebarParam onClick={onSaveStrategy} isDisabled={!strategyDirty}>
        {t('ui.save')}
      </SidebarParam>
      <SidebarParam onClick={onOpenSaveStrategyAsModal}>
        {t('ui.saveAs')}
      </SidebarParam>
      <SidebarParam onClick={onExportStrategy}>
        {t('strategyEditor.exportStrategy')}
      </SidebarParam>
      {!executionId && (
        <SidebarParam onClick={onOpenRemoveModal} isDisabled={!strategyId}>
          {t('ui.removeBtn')}
        </SidebarParam>
      )}
      <SidebarParam onClick={onClose}>
        {t('strategyEditor.closeStrategy')}
      </SidebarParam>
    </div>
  )
}

ParamsForSandbox.propTypes = {
  startExecution: PropTypes.func.isRequired,
  onExportStrategy: PropTypes.func.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
  onOpenRemoveModal: PropTypes.func.isRequired,
  onImportStrategy: PropTypes.func.isRequired,
  onOpenCreateStrategyModal: PropTypes.func.isRequired,
  onOpenCreateStrategyFromModal: PropTypes.func.isRequired,
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  strategyId: PropTypes.string,
  strategyDirty: PropTypes.bool.isRequired,
  isExecutionDisabled: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  executionId: PropTypes.string,
}

ParamsForSandbox.defaultProps = {
  strategyId: '',
  executionId: null,
}

export default ParamsForSandbox
