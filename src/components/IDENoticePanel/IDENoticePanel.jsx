import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'

import './style.css'

const IDENoticePanel = () => {
  const { t } = useTranslation()

  return (
    <div className='hfui-ide-notice'>
      <p>{t('strategyEditor.IDEreadonlyNotice')}</p>
    </div>
  )
}

export default memo(IDENoticePanel)
