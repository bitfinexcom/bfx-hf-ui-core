import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'

const HelpTabTitle = ({ sidebarOpened }) => {
  const { t } = useTranslation()
  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='question-circle-o' className='title-icon' />
      {sidebarOpened && <span>{t('strategyEditor.helpTab')}</span>}
    </div>
  )
}

HelpTabTitle.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
}

export default memo(HelpTabTitle)
