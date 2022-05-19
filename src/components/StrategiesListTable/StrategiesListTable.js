import React from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _size from 'lodash/size'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import {
  getSortedByTimeStrategies, getSortedByTimeActiveStrategies, sortedByTimePastStrategies,
  getRunningStrategiesMapping, getLiveExecutionResults,
} from '../../redux/selectors/ws'
import { getMarketPair } from '../../redux/selectors/meta'
import PastStrategiesList from './PastStrategiesList'
import ActiveStrategiesList from './ActiveStrategiesList'
import SavedStrategiesList from './SavedStrategiesList'

import './style.css'

const StrategiesListTable = ({ onLoadStrategy }) => {
  const { t } = useTranslation()
  const _getMarketPair = useSelector(getMarketPair)
  let activeStrategies = useSelector(getSortedByTimeActiveStrategies)
  const runningStrategiesMapping = useSelector(getRunningStrategiesMapping)
  const liveExecutionResults = useSelector(getLiveExecutionResults)
  const pastStrategies = useSelector(sortedByTimePastStrategies)
  const savedStrategies = useSelector(getSortedByTimeStrategies)

  activeStrategies = _filter(_map(activeStrategies, (activeStrategy) => {
    if (_isEmpty(activeStrategy)) {
      return {}
    }

    const execID = runningStrategiesMapping[activeStrategy.id]
    const results = liveExecutionResults?.[execID] || {}

    return {
      ...activeStrategy,
      results,
    }
  }), strategy => !_isEmpty(strategy))

  const onRowClick = ({ rowData }) => {
    onLoadStrategy(rowData)
  }

  return (
    <Panel
      moveable={false}
      removeable={false}
      className='hfui-strategies-list'
      darkHeader
    >
      <ActiveStrategiesList
        onRowClick={onRowClick}
        getMarketPair={_getMarketPair}
        strategies={activeStrategies}
        tabtitle={t('strategyEditor.activeStrategies')}
        count={_size(activeStrategies)}
      />
      <PastStrategiesList
        onRowClick={onRowClick}
        strategies={pastStrategies}
        getMarketPair={_getMarketPair}
        tabtitle={t('strategyEditor.pastStrategies')}
        count={_size(pastStrategies)}
      />
      <SavedStrategiesList
        onRowClick={onRowClick}
        strategies={savedStrategies}
        tabtitle={t('strategyEditor.savedStrategies')}
        count={_size(savedStrategies)}
      />
    </Panel>
  )
}

StrategiesListTable.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
}

export default StrategiesListTable
