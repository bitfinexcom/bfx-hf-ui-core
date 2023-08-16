import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'
import { Icon } from 'react-fa'
import BacktestOptionsNewTest from './tabs/NewTest'
import HistoryButton from '../../ui/HistoryButton/HistoryButton'
import BacktestHistoryList from './tabs/BacktestHistoryList'
import PanelButton from '../../ui/Panel/Panel.Button'
import BacktestDetails from './tabs/BacktestDetails'

import './style.css'

const BACKTEST_OPTIONS_TABS = {
  NEW_TEST: 'NEW TEST',
  HISTORY_LIST: 'HISTORY_LIST',
  HISTORY_DETAILS: 'HISTORY_DETAILS',
}

const BacktestOptionsPanel = (props) => {
  const [activeTab, setActiveTab] = useState(BACKTEST_OPTIONS_TABS.NEW_TEST)
  const [backtestDetails, setBacktestDetails] = useState(null)
  const { t } = useTranslation()

  const onNewTestTabClick = () => setActiveTab(BACKTEST_OPTIONS_TABS.NEW_TEST)
  const onHistoryTabClick = () => {
    if (activeTab !== BACKTEST_OPTIONS_TABS.NEW_TEST) {
      return
    }
    setActiveTab(BACKTEST_OPTIONS_TABS.HISTORY_LIST)
  }
  const onBackButtonClick = () => setActiveTab(BACKTEST_OPTIONS_TABS.HISTORY_LIST)

  const onBacktestRowClick = ({ rowData }) => {
    setBacktestDetails(rowData)
    setActiveTab(BACKTEST_OPTIONS_TABS.HISTORY_DETAILS)
  }

  return (
    <div className='hfui-strategy-backtest-options'>
      <div className='tabs-menu'>
        {activeTab === BACKTEST_OPTIONS_TABS.HISTORY_DETAILS ? (
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
            isActive={activeTab === BACKTEST_OPTIONS_TABS.NEW_TEST}
            icon={<Icon name='play' className='icon' />}
          />
        )}

        <HistoryButton
          onClick={onHistoryTabClick}
          isActive={activeTab !== BACKTEST_OPTIONS_TABS.NEW_TEST}
          isLoading={false}
        />
      </div>
      {activeTab === BACKTEST_OPTIONS_TABS.NEW_TEST && (
        <BacktestOptionsNewTest {...props} />
      )}
      {activeTab === BACKTEST_OPTIONS_TABS.HISTORY_LIST && (
        <BacktestHistoryList onBacktestRowClick={onBacktestRowClick} />
      )}
      {activeTab === BACKTEST_OPTIONS_TABS.HISTORY_DETAILS && (
        <BacktestDetails backtest={backtestDetails} />
      )}
    </div>
  )
}

export default BacktestOptionsPanel
