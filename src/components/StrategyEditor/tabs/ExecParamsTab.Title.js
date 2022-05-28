import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import Indicator from '../../../ui/Indicator'

const IDETabTitle = ({ sidebarOpened, hasErrors }) => {
  const { t } = useTranslation()

  const indicatorClassName = !sidebarOpened ? 'indicator-near-icon' : null

  const getIndicator = () => {
    if (hasErrors) {
      return <Indicator red className={indicatorClassName} />
    }
    return null
  }

  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='cog' className='title-icon' />
      {sidebarOpened && (
        <span className='title-label'>{t('strategyEditor.execParamsTab')}</span>
      )}
      {getIndicator()}
    </div>
  )
}

IDETabTitle.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
  hasErrors: PropTypes.bool.isRequired,
}

export default memo(IDETabTitle)
