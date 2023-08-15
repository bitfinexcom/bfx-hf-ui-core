import React from 'react'
import { useTranslation } from 'react-i18next'
import _toUpper from 'lodash/toUpper'
import BacktestOptionsNewTest from './BacktestOptions.NewTest'
import HistoryButton from '../../ui/HistoryButton/HistoryButton'
import useToggle from '../../hooks/useToggle'
import BacktestOptionsHistory from './BacktestOptions.History'
import PanelButton from '../../ui/Panel/Panel.Button'

import './style.css'

const BacktestOptionsPanel = (props) => {
  const [isHistoryTabActive, , setHistoryTabActive, setNewTestTabActive] = useToggle(false)
  const { t } = useTranslation()

  return (
    <div className='hfui-strategy-backtest-options'>
      <div className='tabs-menu'>
        <PanelButton
          onClick={setNewTestTabActive}
          text={_toUpper(t('strategyEditor.newTest'))}
          isActive={!isHistoryTabActive}
        />
        <HistoryButton
          onClick={setHistoryTabActive}
          isActive={isHistoryTabActive}
          isLoading={false}
        />
      </div>
      {isHistoryTabActive ? (
        <BacktestOptionsHistory />
      ) : (
        <BacktestOptionsNewTest {...props} />
      )}
    </div>
  )
}

export default BacktestOptionsPanel
