import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import PositionsTableColumns from './PositionsTable.columns'
import { POSITION_SHAPE } from '../../constants/prop-types-shapes'
import './style.css'

const PositionsTable = ({
  setClosePositionModal,
  filteredPositions,
  positions,
  renderedInTradingState,
  getMarketPair,
  tableState,
  updateTableState,
}) => {
  const { t } = useTranslation()
  const columns = useMemo(
    () => PositionsTableColumns(setClosePositionModal, t, getMarketPair),
    [setClosePositionModal, getMarketPair, t],
  )
  const data = renderedInTradingState ? filteredPositions : positions

  if (_isEmpty(data)) {
    return <p className='empty'>{t('positionsTableModal.noPositions')}</p>
  }

  return (
    <div className='hfui-positionlist__wrapper'>
      <VirtualTable
        data={data}
        columns={columns}
        tableState={tableState}
        updateTableState={updateTableState}
        defaultSortBy='id'
        defaultSortDirection='ASC'
      />
    </div>
  )
}

PositionsTable.propTypes = {
  setClosePositionModal: PropTypes.func.isRequired,
  filteredPositions: PropTypes.objectOf(PropTypes.shape(POSITION_SHAPE)),
  positions: PropTypes.objectOf(PropTypes.shape(POSITION_SHAPE)),
  renderedInTradingState: PropTypes.bool,
  getMarketPair: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  tableState: PropTypes.object.isRequired,
  updateTableState: PropTypes.func.isRequired,
}

PositionsTable.defaultProps = {
  filteredPositions: {},
  positions: {},
  renderedInTradingState: false,
}

export default memo(PositionsTable)
