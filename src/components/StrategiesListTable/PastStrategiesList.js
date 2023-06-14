import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { pastStrategiesColumns } from './StrategiesList.columns'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'

const PastStrategiesList = ({
  onRowClick,
  strategies,
  getMarketPair,
  formatTime,
  tableState,
  updateTableState,
}) => {
  const { t } = useTranslation()

  const mappedColumns = useMemo(
    () => pastStrategiesColumns(t, getMarketPair, formatTime),
    [formatTime, getMarketPair, t],
  )

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
          columns={mappedColumns}
          tableState={tableState}
          updateTableState={updateTableState}
          defaultSortBy='startedOn'
          defaultSortDirection='DESC'
          onRowClick={onRowClick}
        />
      )}
    </>
  )
}

PastStrategiesList.propTypes = {
  onRowClick: PropTypes.func.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.shape(STRATEGY_SHAPE)).isRequired,
  getMarketPair: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  tableState: PropTypes.object.isRequired,
  updateTableState: PropTypes.func.isRequired,
}

export default PastStrategiesList
