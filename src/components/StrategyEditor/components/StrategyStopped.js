import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'

const StrategyStopped = ({ onClick }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-sidebar-status paused' onClick={onClick}>
      <Icon name='pause' />
      &nbsp;&nbsp;
      {t('strategyEditor.paused')}
    </div>
  )
}

StrategyStopped.propTypes = {
  onClick: PropTypes.func,
}

StrategyStopped.defaultProps = {
  onClick: () => {},
}

export default memo(StrategyStopped)
