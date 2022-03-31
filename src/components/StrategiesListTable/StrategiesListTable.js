import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _size from 'lodash/size'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Panel from '../../ui/Panel'
import { getSortedByTimeStrategies } from '../../redux/selectors/ws'

import './style.scss'

const StrategiesListTable = ({ onLoadStrategy }) => {
  const strategies = useSelector(getSortedByTimeStrategies)

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
      className='hfui-strategies-list'
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

StrategiesListTable.propTypes = {
  onLoadStrategy: PropTypes.func.isRequired,
}

export default StrategiesListTable
