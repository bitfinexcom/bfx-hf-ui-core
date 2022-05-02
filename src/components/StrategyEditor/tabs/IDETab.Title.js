import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import _values from 'lodash/values'
import _some from 'lodash/some'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import Indicator from '../../../ui/Indicator'

const IDETabTitle = ({ sidebarOpened, strategyDirty, sectionErrors }) => {
  const { t } = useTranslation()

  const hasErrors = useMemo(() => {
    if (!sectionErrors) {
      return false
    }
    const errors = _values(sectionErrors)
    return _some(errors, (error) => error)
  }, [sectionErrors])

  const getIndicator = () => {
    if (hasErrors) {
      return <Indicator red />
    }
    if (strategyDirty) {
      return <Indicator white />
    }
    return null
  }

  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='edit' className='title-icon' />
      {sidebarOpened && <span className='title-label'>{t('strategyEditor.viewInIDETab')}</span>}
      {getIndicator()}
    </div>
  )
}

IDETabTitle.propTypes = {
  sidebarOpened: PropTypes.bool.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  sectionErrors: PropTypes.objectOf(PropTypes.string),
}

IDETabTitle.defaultProps = {
  sectionErrors: null,
}

export default memo(IDETabTitle)
