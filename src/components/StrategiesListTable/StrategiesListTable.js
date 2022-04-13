import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _size from 'lodash/size'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import { getSortedByTimeStrategies } from '../../redux/selectors/ws'
import ActiveStrategiesList from './ActiveStrategiesList'

import './style.scss'

const StrategiesListTable = ({ onLoadStrategy }) => {
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

  const { t } = useTranslation()

  return (
    <Panel
      moveable={false}
      removeable={false}
      className='hfui-strategies-list'
      darkHeader
    >
      <div tabtitle={t('strategyEditor.activeStrategies', { amount: 0 })}>
        {null}
      </div>
      <ActiveStrategiesList
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
