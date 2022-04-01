import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@ufx-ui/core'

import { getIsPaperTrading } from '../../redux/selectors/ui'

function LoadingMode() {
  const isPaperTrading = useSelector(getIsPaperTrading)
  const { t } = useTranslation()
  const mode = isPaperTrading ? t('main.sandbox') : t('main.production')

  return (
    <div className='hfui-loading__mode'>
      <Spinner size='3x' />
      <div className='content'>
        {t('modeChange.changingTo')}
        {' '}
        <span className='highlight'>{mode}</span>
        {' '}
        {t('main.mode')}
      </div>
      <div className='line-2'>
        {t('modeChange.line_2')}
        ..
      </div>
    </div>
  )
}

LoadingMode.propTypes = {}

export default LoadingMode
