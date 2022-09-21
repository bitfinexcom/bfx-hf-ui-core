import React from 'react'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'

const StrategyPaused = () => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-sidebar-status paused'>
      <Icon name='pause' />
      &nbsp;&nbsp;
      <p>{t('strategyEditor.connectionLost')}</p>
    </div>
  )
}

export default StrategyPaused
