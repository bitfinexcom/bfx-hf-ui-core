import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import SidebarParam from './SidebarParam'

const ParamsForLive = ({
  startExecution,
  isExecutionDisabled,
  executing,
  stopExecution,
  onClose,
}) => {
  const { t } = useTranslation()
  return (
    <div className='hfui-orderform__ao-settings__menu-buttons'>
      <SidebarParam onClick={startExecution} isDisabled={isExecutionDisabled}>
        <Icon name='play' />
        &nbsp;&nbsp;
        {t('strategyEditor.launchStrategy')}
      </SidebarParam>
      <SidebarParam onClick={stopExecution} isDisabled={!executing}>
        <Icon name='stop' />
        &nbsp;&nbsp;
        {t('strategyEditor.stopExec')}
      </SidebarParam>
      <div className='hfui-navbar__layout-settings__separator' />
      <SidebarParam onClick={onClose}>
        {t('strategyEditor.closeStrategy')}
      </SidebarParam>
    </div>
  )
}

ParamsForLive.propTypes = {
  startExecution: PropTypes.func.isRequired,
  isExecutionDisabled: PropTypes.bool.isRequired,
  executing: PropTypes.bool.isRequired,
  stopExecution: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}
export default ParamsForLive
