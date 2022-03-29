import React, { useMemo, useState } from 'react'
import _map from 'lodash/map'
import _size from 'lodash/size'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import UIActions from '../../redux/actions/ui'
import Panel from '../../ui/Panel'
import { getSortedByTimeStrategies } from '../../redux/selectors/ws'

const StrategiesListTable = ({ onLoadStrategy }) => {
  const selectedTab = useSelector(state => state.ui.tab)
  const strategies = useSelector(getSortedByTimeStrategies)

  const [forcedTab, setForcedTab] = useState(selectedTab)

  const dispatch = useDispatch()
  const setStrategyTab = (tab) => dispatch(UIActions.setStrategyTab(tab))

  const strategyNodesArray = useMemo(() => {
    return _map(strategies, (str, index) => {
      // if (index >= 6) {
      //   return null
      // }
      return (
        <li
          key={str.id}
          className='strategy-item'
          onClick={() => onLoadStrategy(str)}
        >
          {str.label}
        </li>
      )
    })
  }, [strategies])

  const { t } = useTranslation()

  return (
    <Panel
      moveable
      removeable={false}
      forcedTab={forcedTab}
      onTabChange={setStrategyTab}
      darkHeader
    >
      <div tabtitle={t('strategyEditor.activeStrategies', { amount: 0 })}>
        {null}
      </div>
      <ul className='strategies-list' tabtitle={t('strategyEditor.pastStrategies', { amount: _size(strategyNodesArray) })}>
        {strategyNodesArray}
      </ul>
    </Panel>
  )
}

export default StrategiesListTable
