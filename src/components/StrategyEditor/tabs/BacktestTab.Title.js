import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import { Icon } from 'react-fa'
import Indicator from '../../../ui/Indicator'

const BacktestTabTitle = ({ results, sidebarOpened }) => {
  const { t } = useTranslation()

  const { loading, finished } = results

  const indicatorClassName = !sidebarOpened && 'indicator-near-icon'

  return (
    <div className='hfui-strategyeditor__sidebar-title'>
      <Icon name='repeat' className='title-icon' />
      {sidebarOpened && (
        <span className='title-label'>
          {t('strategyEditor.backtestTab')}
        </span>
      )}
      {loading && <Indicator white blinking className={indicatorClassName} />}
      {finished && !loading && <Indicator green className={indicatorClassName} />}
    </div>
  )
}

BacktestTabTitle.propTypes = {
  results: PropTypes.shape({
    loading: PropTypes.bool,
    finished: PropTypes.bool,
  }).isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
}

export default BacktestTabTitle
