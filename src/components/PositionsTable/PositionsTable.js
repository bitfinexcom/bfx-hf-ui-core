import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import PositionsTableColumns from './PositionsTable.columns'

const PositionsTable = (props) => {
  const { t } = useTranslation()
  const {
    closePosition,
    authToken,
    filteredPositions,
    positions,
    renderedInTradingState,
  } = props

  const data = renderedInTradingState ? filteredPositions : positions

  if (_isEmpty(data)) {
    return <p className='empty'>{t('positionsTableModal.noPositions')}</p>
  }

  return (
    <VirtualTable
      data={data}
      columns={PositionsTableColumns({ authToken, closePosition, t })}
      defaultSortBy='id'
      defaultSortDirection='ASC'
    />
  )
}

PositionsTable.propTypes = {
  closePosition: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  filteredPositions: PropTypes.arrayOf(PropTypes.object),
  positions: PropTypes.arrayOf(PropTypes.object),
  renderedInTradingState: PropTypes.bool,
}

PositionsTable.defaultProps = {
  filteredPositions: [],
  positions: [],
  renderedInTradingState: false,
}

export default memo(PositionsTable)
