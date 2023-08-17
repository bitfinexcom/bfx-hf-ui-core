import React from 'react'
import { useTranslation } from 'react-i18next'
import PropTypes from 'prop-types'
import _toUpper from 'lodash/toUpper'
import { Icon } from 'react-fa'
import BacktestOptionsNewTest from './tabs/NewTest'
import HistoryButton from '../../ui/HistoryButton/HistoryButton'
import BacktestHistoryList from './tabs/BacktestHistoryList'
import PanelButton from '../../ui/Panel/Panel.Button'
import BacktestDetails from './tabs/BacktestDetails'
import { BACKTEST_TAB_SECTIONS } from '../StrategyEditor/tabs/BacktestTab'

import './style.css'

const BacktestOptionsPanel = (props) => {
  const { setActiveSection, activeSection, setBtHistoryId } = props

  const { t } = useTranslation()

  const onNewTestTabClick = () => setActiveSection(BACKTEST_TAB_SECTIONS.NEW_BT)
  const onHistoryTabClick = () => {
    if (activeSection !== BACKTEST_TAB_SECTIONS.NEW_BT) {
      return
    }
    setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_LIST)
  }
  const onBackButtonClick = () => setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_LIST)

  const onBacktestRowClick = ({ rowData }) => {
    setBtHistoryId(rowData.executionId)
    setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_DETAILS)
  }

  return (
    <div className='hfui-strategy-backtest-options'>
      <div className='tabs-menu'>
        {activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_DETAILS ? (
          <PanelButton
            onClick={onBackButtonClick}
            text={_toUpper(t('ui.goBack'))}
            isActive={false}
            icon={<Icon name='arrow-left' className='icon' />}
          />
        ) : (
          <PanelButton
            onClick={onNewTestTabClick}
            text={_toUpper(t('strategyEditor.newTest'))}
            isActive={activeSection === BACKTEST_TAB_SECTIONS.NEW_BT}
            icon={<Icon name='play' className='icon' />}
          />
        )}

        <HistoryButton
          onClick={onHistoryTabClick}
          isActive={activeSection !== BACKTEST_TAB_SECTIONS.NEW_BT}
          isLoading={false}
        />
      </div>
      {activeSection === BACKTEST_TAB_SECTIONS.NEW_BT && (
        <BacktestOptionsNewTest {...props} />
      )}
      {activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_LIST && (
        <BacktestHistoryList onBacktestRowClick={onBacktestRowClick} />
      )}
      {activeSection === BACKTEST_TAB_SECTIONS.HISTORY_BT_DETAILS && (
        <BacktestDetails {...props} />
      )}
    </div>
  )
}

BacktestOptionsPanel.propTypes = {
  activeSection: PropTypes.string.isRequired,
  setActiveSection: PropTypes.func.isRequired,
  setBtHistoryId: PropTypes.func.isRequired,
}

export default BacktestOptionsPanel
