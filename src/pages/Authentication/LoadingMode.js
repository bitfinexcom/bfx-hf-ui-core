import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@ufx-ui/core'
import { getIsPaperTrading } from '../../redux/selectors/ui'

function LoadingMode() {
  const isPaperTrading = useSelector(getIsPaperTrading)
  const { t } = useTranslation()
  return (
    <div className='hfui-loading__mode'>
      <Spinner size='2x' />
      <div className='content'>
        Loading
        {' '}
        {isPaperTrading ? t('main.sandbox') : t('main.production')}
        ...
      </div>
    </div>
  )
}

LoadingMode.propTypes = {}

export default LoadingMode
