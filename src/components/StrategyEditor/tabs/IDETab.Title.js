import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'

const IDETabTitle = ({ sidebarOpened }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='edit' className='title-icon' />
      {sidebarOpened && (
        <span className='title-label'>{t('strategyEditor.viewInIDETab')}</span>
      )}
    </div>
  )
}

IDETabTitle.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
}

export default memo(IDETabTitle)
