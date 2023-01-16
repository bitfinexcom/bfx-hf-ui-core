import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Button from '../../ui/Button'

const BacktestResultsOptionsPanel = ({ showFullscreenChart, openNewTest }) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-options'>
      <div className='hfui-strategy-options__results-container'>
        <p>{t('strategyEditor.backtestSuccessful')}</p>
        <Button
          className='hfui-strategy-options__option-btn'
          label={t('strategyEditor.newTest')}
          onClick={openNewTest}
          green
        />
      </div>
      <Button
        className='hfui-strategy-options__backtest-result-btn'
        label={t('strategyEditor.fullscreenChartBtn')}
        onClick={showFullscreenChart}
        green
      />
    </div>
  )
}

BacktestResultsOptionsPanel.propTypes = {
  showFullscreenChart: PropTypes.func.isRequired,
  openNewTest: PropTypes.func.isRequired,
}

export default BacktestResultsOptionsPanel
