import React from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import {
  getSortedByTimeActiveStrategies,
  sortedByTimePastStrategies,
  getDraftStrategies,
  getSortedByTimeStrategies,
} from '../../redux/selectors/ws'
import {
  getExecutionMarketPair,
  getMarketsForExecution,
} from '../../redux/selectors/meta'
import PastStrategiesList from './PastStrategiesList'
import ActiveStrategiesList from './ActiveStrategiesList'
import SavedStrategiesList from './SavedStrategiesList'
import { prepareStrategyToLoad } from '../StrategyEditor/StrategyEditor.helpers'
import { getIsPaperTrading } from '../../redux/selectors/ui'

import './style.css'

const StrategiesListTable = ({
  onLoadStrategy,
  onStrategyRemove,
  saveAsHandler,
  renameStrategy,
}) => {
  const { t } = useTranslation()
  const _getMarketPair = useSelector(getExecutionMarketPair)
  const activeStrategies = useSelector(getSortedByTimeActiveStrategies())
  const pastStrategies = useSelector(sortedByTimePastStrategies)
  const savedStrategies = useSelector(getSortedByTimeStrategies)
  const draftStrategies = useSelector(getDraftStrategies)
  const markets = useSelector(getMarketsForExecution)
  const isPaperTrading = useSelector(getIsPaperTrading)

  const onRowClick = ({ rowData }) => {
    onLoadStrategy(rowData)
  }

  const onStrategyRowClick = (strategy) => {
    const newStrategyObject = prepareStrategyToLoad(
      strategy,
      markets,
      savedStrategies,
    )
    onLoadStrategy(newStrategyObject)
  }

  const onActiveStrategyRowClick = ({ rowData: strategy }) => {
    return onStrategyRowClick(strategy)
  }

  const onPastStrategyRowClick = ({ rowData: strategy }) => {
    return onStrategyRowClick(strategy)
  }

  return (
    <Panel
      moveable={false}
      removeable={false}
      className='hfui-strategies-list'
      darkHeader
    >
      {!isPaperTrading && (
        <ActiveStrategiesList
          onRowClick={onActiveStrategyRowClick}
          getMarketPair={_getMarketPair}
          strategies={activeStrategies}
          tabtitle={t('strategyEditor.activeStrategies')}
          count={_size(activeStrategies)}
        />
      )}
      <PastStrategiesList
        strategies={pastStrategies}
        getMarketPair={_getMarketPair}
        tabtitle={t('strategyEditor.pastStrategies')}
        count={_size(pastStrategies)}
        onRowClick={onPastStrategyRowClick}
      />
      {isPaperTrading && (
        <SavedStrategiesList
          onRowClick={onRowClick}
          strategies={draftStrategies}
          tabtitle={t('strategyEditor.savedStrategies')}
          count={_size(draftStrategies)}
          onStrategyRemove={onStrategyRemove}
          saveAsHandler={saveAsHandler}
          renameStrategy={renameStrategy}
        />
      )}
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
