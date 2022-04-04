import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'

const StrategyRunned = ({ onClick }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-sidebar-status running' onClick={onClick}>
      <Icon name='circle' />
      &nbsp;&nbsp;
      {t('strategyEditor.running')}
    </div>
  )
}

StrategyRunned.propTypes = {
  onClick: PropTypes.func,
}

StrategyRunned.defaultProps = {
  onClick: () => {},
}

export default memo(StrategyRunned)
