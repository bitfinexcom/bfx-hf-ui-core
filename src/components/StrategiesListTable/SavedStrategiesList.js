import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { savedStrategiesColumns } from './StrategiesList.columns'
import { STRATEGY_SHAPE } from '../../constants/prop-types-shapes'

const SavedStrategiesList = ({
  onRowClick,
  strategies,
  onStrategyRemove,
  saveAsHandler,
  renameStrategy,
  formatTime,
  tableState,
  updateTableState,
}) => {
  const { t } = useTranslation()

  const mappedColumns = useMemo(
    () => savedStrategiesColumns({
      t,
      onStrategyRemove,
      saveAsHandler,
      renameStrategy,
      formatTime,
    }),
    [onStrategyRemove, renameStrategy, saveAsHandler, t, formatTime],
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
          defaultSortBy='savedTs'
          defaultSortDirection='DESC'
          onRowClick={onRowClick}
        />
      )}
    </>
  )
}

SavedStrategiesList.propTypes = {
  onRowClick: PropTypes.func.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.shape(STRATEGY_SHAPE)).isRequired,
  onStrategyRemove: PropTypes.func.isRequired,
  saveAsHandler: PropTypes.func.isRequired,
  renameStrategy: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  tableState: PropTypes.object.isRequired,
  updateTableState: PropTypes.func.isRequired,
}

export default SavedStrategiesList
