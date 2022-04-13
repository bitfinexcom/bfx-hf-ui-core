import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { getSortedByTimeStrategies } from '../../redux/selectors/ws'
import StrategiesListColumns from './StrategiesList.columns'

const ActiveStrategiesList = ({ onRowClick }) => {
  const strategies = useSelector(getSortedByTimeStrategies)

  const { t } = useTranslation()

  return (
    <>
      {_isEmpty(strategies) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('strategyEditor.noActiveStrategies')}
          </span>
        </div>
      ) : (
        <VirtualTable
          data={strategies}
          columns={StrategiesListColumns(t)}
          defaultSortBy='mts'
          defaultSortDirection='DESC'
          onRowClick={onRowClick}
        />
      )}
    </>
  )
}

ActiveStrategiesList.propTypes = {
  onRowClick: PropTypes.func.isRequired,
}

export default ActiveStrategiesList
