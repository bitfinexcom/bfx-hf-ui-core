import React from 'react'
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
  const { t } = useTranslation()
  const activeStrategies = useSelector(getSortedByTimeActiveStrategies)
  const strategies = useSelector(getSortedByTimeStrategies)

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
        strategies={activeStrategies}
        tabtitle={t('strategyEditor.activeStrategies', { amount: _size(activeStrategies) })}
      />
      <PastStrategiesList
        onRowClick={onRowClick}
        strategies={strategies}
        tabtitle={t('strategyEditor.pastStrategies', { amount: _size(strategies) })}
      />
    </Panel>
  )
}

StrategiesListTable.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
}

export default StrategiesListTable
