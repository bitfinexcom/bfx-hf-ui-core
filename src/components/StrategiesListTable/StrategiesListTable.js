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
import { getMarketPair, getMarketsForExecution } from '../../redux/selectors/meta'
import PastStrategiesList from './PastStrategiesList'
import ActiveStrategiesList from './ActiveStrategiesList'
import SavedStrategiesList from './SavedStrategiesList'
import { prepareStrategyToLoad } from '../StrategyEditor/StrategyEditor.helpers'

import './style.css'

const StrategiesListTable = ({
  onLoadStrategy, onStrategyRemove, saveAsHandler, renameStrategy,
}) => {
  const { t } = useTranslation()
  const _getMarketPair = useSelector(getMarketPair)
  let activeStrategies = useSelector(getSortedByTimeActiveStrategies)
  const runningStrategiesMapping = useSelector(getRunningStrategiesMapping)
  const liveExecutionResults = useSelector(getLiveExecutionResults)
  const pastStrategies = useSelector(sortedByTimePastStrategies)
  const savedStrategies = useSelector(getSortedByTimeStrategies)
  const markets = useSelector(getMarketsForExecution)

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

  const onActiveOrPastStrategyRowClick = ({ rowData: strategy }) => {
    const newStrategyObject = prepareStrategyToLoad(strategy, markets, savedStrategies)
    onLoadStrategy(newStrategyObject)
  }

  return (
    <Panel
      moveable={false}
      removeable={false}
      className='hfui-strategies-list'
      darkHeader
    >
      <ActiveStrategiesList
        onRowClick={onActiveOrPastStrategyRowClick}
        getMarketPair={_getMarketPair}
        strategies={activeStrategies}
        tabtitle={t('strategyEditor.activeStrategies')}
        count={_size(activeStrategies)}
      />
      <PastStrategiesList
        strategies={pastStrategies}
        getMarketPair={_getMarketPair}
        tabtitle={t('strategyEditor.pastStrategies')}
        count={_size(pastStrategies)}
        onRowClick={onActiveOrPastStrategyRowClick}

      />
      <SavedStrategiesList
        onRowClick={onRowClick}
        strategies={savedStrategies}
        tabtitle={t('strategyEditor.savedStrategies')}
        count={_size(savedStrategies)}
        onStrategyRemove={onStrategyRemove}
        saveAsHandler={saveAsHandler}
        renameStrategy={renameStrategy}
      />
    </Panel>
  )
}

StrategiesListTable.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
  onStrategyRemove: PropTypes.func.isRequired,
  saveAsHandler: PropTypes.func.isRequired,
  renameStrategy: PropTypes.func.isRequired,
}

export default StrategiesListTable
