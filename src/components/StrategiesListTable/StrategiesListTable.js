import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _size from 'lodash/size'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import {
  getSortedByTimeStrategies, getSortedByTimeActiveStrategies,
} from '../../redux/selectors/ws'
import PastStrategiesList from './PastStrategiesList'
import ActiveStrategiesList from './ActiveStrategiesList'

import './style.css'

const StrategiesListTable = ({ onLoadStrategy }) => {
  const activeStrategies = useSelector(getSortedByTimeActiveStrategies)
  const strategies = useSelector(getSortedByTimeStrategies)

  const onRowClick = ({ rowData }) => {
    onLoadStrategy(rowData)
  }

  const strategyNodesArray = useMemo(() => {
    return _map(strategies, (str) => {
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
  }, [strategies]) // eslint-disable-line react-hooks/exhaustive-deps

  const activeStrategiesNodesArray = useMemo(() => {
    return _map(activeStrategies, (str) => {
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
  }, [activeStrategies]) // eslint-disable-line react-hooks/exhaustive-deps

  const { t } = useTranslation()

  return (
    <Panel
      moveable={false}
      removeable={false}
      className='hfui-strategies-list'
      darkHeader
    >
      <ActiveStrategiesList
        onRowClick={onRowClick}
        strategies={activeStrategies}
        tabtitle={t('strategyEditor.activeStrategies', { amount: _size(activeStrategiesNodesArray) })}
      />
      <PastStrategiesList
        onRowClick={onRowClick}
        tabtitle={t('strategyEditor.pastStrategies', { amount: _size(strategyNodesArray) })}
      />
    </Panel>
  )
}

StrategiesListTable.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
}

export default StrategiesListTable
