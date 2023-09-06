import React from 'react'
import _toUpper from 'lodash/toUpper'
import _get from 'lodash/get'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Icon } from 'react-fa'
import Button from '../../ui/Button'
import {
  getBacktestActiveSection,
  getFormatTimeFn,
} from '../../redux/selectors/ui'
import { renderDate } from '../../util/ui'
import PanelButton from '../../ui/Panel/Panel.Button'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { BACKTEST_TAB_SECTIONS } from '../../redux/reducers/ui'
import { getCurrentHistoryBacktest } from '../../redux/selectors/ws'

const renderBacktestRange = (backtest, formatTime, t) => (
  <p>
    {t('strategyEditor.backtestHistoryResults')}
    &nbsp;
    <b>{renderDate(_get(backtest, 'start', 0), formatTime, false)}</b>
    &nbsp; - &nbsp;
    <b>{renderDate(_get(backtest, 'end', 0), formatTime, false)}</b>
  </p>
)

const BacktestResultsOptionsPanel = ({ showFullscreenChart }) => {
  const formatTime = useSelector(getFormatTimeFn)
  const backtest = useSelector(getCurrentHistoryBacktest)
  const activeSection = useSelector(getBacktestActiveSection)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const setActiveSection = (section) => dispatch(UIActions.setBacktestActiveSection(section))
  const onBackButtonClick = () => setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_DETAILS)
  const onNewTestButtonClick = () => {
    dispatch(WSActions.purgeBacktestData())
    setActiveSection(BACKTEST_TAB_SECTIONS.NEW_BT)
  }

  const showBtHistoryResults = activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_RESULTS

  return (
    <div className='hfui-strategy-options'>
      {showBtHistoryResults ? (
        <div className='hfui-strategy-options__results-container'>
          <PanelButton
            onClick={onBackButtonClick}
            text={_toUpper(t('ui.goBack'))}
            isActive={false}
            icon={<Icon name='arrow-left' className='icon' />}
          />
          {renderBacktestRange(backtest, formatTime, t)}
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
          {renderBacktestRange(backtest, formatTime, t)}
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
}

export default BacktestResultsOptionsPanel