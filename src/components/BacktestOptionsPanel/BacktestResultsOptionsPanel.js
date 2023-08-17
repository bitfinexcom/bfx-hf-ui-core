import React from 'react'
import _toUpper from 'lodash/toUpper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { Icon } from 'react-fa'
import Button from '../../ui/Button'
import { getFormatTimeFn } from '../../redux/selectors/ui'
import { renderDate } from '../../util/ui'
import PanelButton from '../../ui/Panel/Panel.Button'
import { BACKTEST_TAB_SECTIONS } from '../StrategyEditor/tabs/BacktestTab'

const BacktestResultsOptionsPanel = ({
  showFullscreenChart,
  openNewTest,
  backtestTimestamp,
  activeSection,
  setActiveSection,
}) => {
  const { t } = useTranslation()
  const formatTime = useSelector(getFormatTimeFn)

  const onBackButonClick = () => setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_DETAILS)
  const onNewTestButtonClick = () => {
    if (activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS) {
      setActiveSection(BACKTEST_TAB_SECTIONS.NEW_BT)
      return
    }
    openNewTest()
  }

  const showBtHistoryResults = activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS

  return (
    <div className='hfui-strategy-options'>
      {showBtHistoryResults ? (
        <div className='hfui-strategy-options__results-container'>
          <PanelButton
            onClick={onBackButonClick}
            text={_toUpper(t('ui.goBack'))}
            isActive={false}
            icon={<Icon name='arrow-left' className='icon' />}
          />
          <p>
            {t('strategyEditor.backtestHistoryResults')}
            &nbsp;
            <b>{renderDate(backtestTimestamp, formatTime, false)}</b>
          </p>
          <Button
            className='hfui-strategy-options__option-btn'
            label={t('strategyEditor.newTest')}
            onClick={onNewTestButtonClick}
            green
          />
        </div>
      ) : (
        <div className='hfui-strategy-options__results-container'>
          <p>{t('strategyEditor.backtestSuccessful')}</p>
          <Button
            className='hfui-strategy-options__option-btn'
            label={t('strategyEditor.newTest')}
            onClick={onNewTestButtonClick}
            green
          />
        </div>
      )}

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
  setActiveSection: PropTypes.func.isRequired,
  activeSection: PropTypes.string.isRequired,
  backtestTimestamp: PropTypes.number,
}

BacktestResultsOptionsPanel.defaultProps = {
  backtestTimestamp: null,
}

export default BacktestResultsOptionsPanel
