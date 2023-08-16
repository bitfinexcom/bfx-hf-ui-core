import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'
import _bind from 'lodash/bind'
import BacktestOptionsNewTest from './tabs/NewTest'
import HistoryButton from '../../ui/HistoryButton/HistoryButton'
import BacktestHistoryList from './tabs/BacktestHistoryList'
import PanelButton from '../../ui/Panel/Panel.Button'

import './style.css'

const BACKTEST_OPTIONS_TABS = {
  NEW_TEST: 'NEW TEST',
  HISTORY_LIST: 'HISTORY_LIST',
  HISTORY_DETAILS: 'HISTORY_DETAILS',
}

const BacktestOptionsPanel = (props) => {
  const [activeTab, setActiveTab] = useState(BACKTEST_OPTIONS_TABS.NEW_TEST)
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-backtest-options'>
      <div className='tabs-menu'>
        <PanelButton
          onClick={_bind(setActiveTab, BACKTEST_OPTIONS_TABS.NEW_TEST)}
          text={_toUpper(t('strategyEditor.newTest'))}
          isActive={activeTab === BACKTEST_OPTIONS_TABS.NEW_TEST}
        />
        <HistoryButton
          onClick={_bind(setActiveTab, BACKTEST_OPTIONS_TABS.HISTORY_LIST)}
          isActive={activeTab === BACKTEST_OPTIONS_TABS.HISTORY_LIST}
          isLoading={false}
        />
      </div>
      {activeTab === BACKTEST_OPTIONS_TABS.NEW_TEST && (
        <BacktestOptionsNewTest {...props} />
      )}
      {activeTab === BACKTEST_OPTIONS_TABS.HISTORY_LIST && (
        <BacktestHistoryList />
      )}
    </div>
  )
}

export default BacktestOptionsPanel
