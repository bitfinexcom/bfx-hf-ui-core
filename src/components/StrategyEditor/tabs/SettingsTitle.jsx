import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'

const SettingsTabTitle = ({ sidebarOpened }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='cog' className='title-icon' />
      {sidebarOpened && (
        <span className='title-label'>
          {t('strategyEditor.strategyOptionsBtn')}
        </span>
      )}
    </div>
  )
}

SettingsTabTitle.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
}

export default memo(SettingsTabTitle)
