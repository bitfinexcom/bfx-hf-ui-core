import React from 'react'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'
import { Icon } from 'react-fa'
import { useDispatch, useSelector } from 'react-redux'
import BacktestOptionsNewTest from './tabs/NewTest'
import HistoryButton from '../../ui/HistoryButton/HistoryButton'
import BacktestHistoryList from './tabs/BacktestHistoryList'
import PanelButton from '../../ui/Panel/Panel.Button'
import BacktestDetails from './tabs/BacktestDetails'
import { BACKTEST_TAB_SECTIONS } from '../../redux/reducers/ui'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getBacktestActiveSection } from '../../redux/selectors/ui'

import './style.css'

const BacktestOptionsPanel = (props) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const activeSection = useSelector(getBacktestActiveSection)

  const setActiveSection = (section) => dispatch(UIActions.setBacktestActiveSection(section))
  const onNewTestTabClick = () => setActiveSection(BACKTEST_TAB_SECTIONS.NEW_BT)
  const onHistoryTabClick = () => {
    if (activeSection !== BACKTEST_TAB_SECTIONS.NEW_BT) {
      return
    }
    setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_LIST)
  }
  const onBackButtonClick = () => setActiveSection(BACKTEST_TAB_SECTIONS.HISTORY_BT_LIST)

  const onBacktestRowClick = ({ rowData }) => {
    dispatch(WSActions.setHistoryBacktestId(rowData.executionId))
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
        <BacktestDetails />
      )}
    </div>
  )
}

export default BacktestOptionsPanel
