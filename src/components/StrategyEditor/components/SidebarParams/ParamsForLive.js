import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import SidebarParam from './SidebarParam'

const ParamsForLive = ({
  executing,
  stopExecution,
  onClose,
  editInSandbox,
}) => {
  const { t } = useTranslation()
  return (
    <div className='hfui-orderform__ao-settings__menu-buttons'>
      <SidebarParam onClick={stopExecution} isDisabled={!executing}>
        <Icon name='stop' />
        &nbsp;&nbsp;
        {t('strategyEditor.stopExec')}
      </SidebarParam>
      <div className='hfui-navbar__layout-settings__separator' />
      <SidebarParam onClick={editInSandbox}>
        <Icon name='edit' />
        &nbsp;&nbsp;
        {t('strategyEditor.editInSandbox')}
      </SidebarParam>
      <SidebarParam onClick={onClose}>
        {t('strategyEditor.closeStrategy')}
      </SidebarParam>
    </div>
  )
}

ParamsForLive.propTypes = {
  executing: PropTypes.bool.isRequired,
  stopExecution: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  editInSandbox: PropTypes.func.isRequired,
}
export default ParamsForLive
