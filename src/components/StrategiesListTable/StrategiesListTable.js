import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import _get from 'lodash/get'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Button } from '@ufx-ui/core'
import { Icon } from 'react-fa'
import cx from 'clsx'

import Panel from '../../ui/Panel'
import useToggle from '../../hooks/useToggle'
import {
  getSortedByTimeActiveStrategies,
  sortedByTimePastStrategies,
  getDraftStrategies,
  getSortedByTimeStrategies,
} from '../../redux/selectors/ws'
import {
  getMarketPair,
  getMarketsForExecution,
} from '../../redux/selectors/meta'
import PastStrategiesList from './PastStrategiesList'
import ActiveStrategiesList from './ActiveStrategiesList'
import SavedStrategiesList from './SavedStrategiesList'
import { prepareStrategyToLoad } from '../StrategyEditor/StrategyEditor.helpers'
import {
  getComponentState,
  getFormatTimeFn,
  getIsPaperTrading,
  getUIState,
} from '../../redux/selectors/ui'
import UIActions from '../../redux/actions/ui'
import { UI_KEYS } from '../../redux/constants/ui_keys'

import './style.css'
import { MAIN_MODE, PAPER_MODE } from '../../redux/reducers/ui'

const COMPONENT_ID = 'STRATEGIES_LIST_TABLE'
const STATE_KEYS = {
  TAB: 'tab',
  ACTIVE_STARETGIES_TABLE: 'activeStrategiesTable',
  SAVED_STRATEGIES_TABLE: 'savedStrategiesTable',
  PAST_STRATEGIES_TABLE: 'pastStrategiesTable',
}

const StrategiesListTable = ({
  onLoadStrategy,
  onStrategyRemove,
  saveAsHandler,
  renameStrategy,
}) => {
  const { t } = useTranslation()

  const _getMarketPair = useSelector(getMarketPair)
  const activeStrategies = useSelector(getSortedByTimeActiveStrategies())
  const pastStrategies = useSelector(sortedByTimePastStrategies)
  const savedStrategies = useSelector(getSortedByTimeStrategies)
  const draftStrategies = useSelector(getDraftStrategies)
  const markets = useSelector(getMarketsForExecution)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const formatTime = useSelector(getFormatTimeFn)
  const layoutID = useSelector((state) => getUIState(state, UI_KEYS.layoutID))
  const savedState = useSelector((state) => getComponentState(state, layoutID, null, COMPONENT_ID),
  )

  const mode = isPaperTrading ? PAPER_MODE : MAIN_MODE
  const activeTabs = _get(savedState, STATE_KEYS.TAB, {})
  const activeTab = _get(activeTabs, mode, null)

  const dispatch = useDispatch()

  const saveState = (param, value) => {
    dispatch(
      UIActions.updateComponentState({
        state: {
          [param]: value,
        },
        layoutID,
        componentID: COMPONENT_ID,
      }),
    )
  }

  const onTabChange = (tab) => {
    saveState(STATE_KEYS.TAB, {
      ...activeTabs,
      [mode]: tab,
    })
  }

  const updateTableState = (table) => (newState) => {
    saveState(table, {
      ..._get(savedState, table, {}),
      ...newState,
    })
  }

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

  const [isExpanded, toggle] = useToggle(false)

  return (
    <div className='hfui-strategies-list__wrapper'>
      <Panel
        moveable={false}
        removeable={false}
        className={cx('hfui-strategies-list', { expanded: isExpanded })}
        darkHeader
        hasShadow={isExpanded}
        forcedTab={activeTab}
        onTabChange={onTabChange}
        preHeaderComponents={(
          <>
            {isExpanded ? (
              <Button className='panel-button' onClick={toggle}>
                <Icon name='compress' />
                &nbsp;&nbsp;
                <span>{t('ui.compressPanel')}</span>
              </Button>
            ) : (
              <Button className='panel-button' onClick={toggle}>
                <Icon name='expand' />
                &nbsp;&nbsp;
                <span>{t('ui.expandPanel')}</span>
              </Button>
            )}
          </>
        )}
      >
        {!isPaperTrading && (
          <ActiveStrategiesList
            onRowClick={onActiveStrategyRowClick}
            getMarketPair={_getMarketPair}
            strategies={activeStrategies}
            tabtitle={t('strategyEditor.activeStrategies')}
            count={_size(activeStrategies)}
            formatTime={formatTime}
            tableState={_get(
              savedState,
              STATE_KEYS.ACTIVE_STARETGIES_TABLE,
              {},
            )}
            updateTableState={updateTableState(
              STATE_KEYS.ACTIVE_STARETGIES_TABLE,
            )}
          />
        )}
        <PastStrategiesList
          strategies={pastStrategies}
          getMarketPair={_getMarketPair}
          tabtitle={t('strategyEditor.pastStrategies')}
          count={_size(pastStrategies)}
          onRowClick={onPastStrategyRowClick}
          formatTime={formatTime}
          tableState={_get(savedState, STATE_KEYS.PAST_STRATEGIES_TABLE, {})}
          updateTableState={updateTableState(STATE_KEYS.PAST_STRATEGIES_TABLE)}
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
            formatTime={formatTime}
            tableState={_get(savedState, STATE_KEYS.SAVED_STRATEGIES_TABLE, {})}
            updateTableState={updateTableState(
              STATE_KEYS.SAVED_STRATEGIES_TABLE,
            )}
          />
        )}
      </Panel>
    </div>
  )
}

StrategiesListTable.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
  onStrategyRemove: PropTypes.func.isRequired,
  saveAsHandler: PropTypes.func.isRequired,
  renameStrategy: PropTypes.func.isRequired,
}

export default StrategiesListTable
