import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import PositionsTableColumns from './PositionsTable.columns'

const PositionsTable = ({
  setClosePositionModal, filteredPositions, positions, renderedInTradingState,
  getMarketPair,
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
    <VirtualTable
      data={data}
      columns={columns}
      defaultSortBy='id'
      defaultSortDirection='ASC'
    />
  )
}

PositionsTable.propTypes = {
  setClosePositionModal: PropTypes.func.isRequired,
  filteredPositions: PropTypes.objectOf(PropTypes.object),
  positions: PropTypes.objectOf(PropTypes.object),
  renderedInTradingState: PropTypes.bool,
  getMarketPair: PropTypes.func.isRequired,
}

PositionsTable.defaultProps = {
  filteredPositions: {},
  positions: {},
  renderedInTradingState: false,
}

export default memo(PositionsTable)
