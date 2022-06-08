import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { savedStrategiesColumns } from './StrategiesList.columns'

const SavedStrategiesList = ({ onRowClick, strategies }) => {
  const { t } = useTranslation()
  console.log(strategies)

  return (
    <>
      {_isEmpty(strategies) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('strategyEditor.noStrategiesToDisplay')}
          </span>
        </div>
      ) : (
        <VirtualTable
          data={strategies}
          columns={savedStrategiesColumns(t)}
          defaultSortBy='mts'
          defaultSortDirection='DESC'
          onRowClick={onRowClick}
        />
      )}
    </>
  )
}

SavedStrategiesList.propTypes = {
  onRowClick: PropTypes.func.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
}

export default SavedStrategiesList
