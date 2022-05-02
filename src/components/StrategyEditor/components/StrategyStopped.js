import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'

const StrategyStopped = ({ onClick }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-sidebar-status stopped' onClick={onClick}>
      <Icon name='stop' />
      &nbsp;&nbsp;
      {t('strategyEditor.stopped')}
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
