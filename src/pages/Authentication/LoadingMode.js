import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@ufx-ui/core'
import { getCurrentMode, getIsPaperTrading } from '../../redux/selectors/ui'

function LoadingMode(props) {
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
