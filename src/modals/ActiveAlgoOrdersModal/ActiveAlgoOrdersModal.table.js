import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import _includes from 'lodash/includes'
import _forEach from 'lodash/forEach'
import _filter from 'lodash/filter'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import columns from './ActiveAlgoOrdersModal.columns'
import { getFormatTimeFn } from '../../redux/selectors/ui'

import './style.css'

const AlgoOrdersTable = ({
  orders,
  selectedOrders,
  setSelectedOrders,
  title,
}) => {
  const { t } = useTranslation()

  const formatTime = useSelector(getFormatTimeFn)

  const onOrderSelect = useCallback(
    (e, gid, algoID) => {
      if (e) {
        setSelectedOrders([...selectedOrders, { gid, algoID }])
      } else {
        setSelectedOrders(
          _filter(selectedOrders, (order) => gid !== order.gid),
        )
      }
    },
    [selectedOrders, setSelectedOrders],
  )

  const isOrderSelected = useCallback(
    (gid) => {
      const gids = []
      _forEach(selectedOrders, (order) => gids.push(order.gid))
      return _includes(gids, gid)
    },
    [selectedOrders],
  )

  const onRowClick = useCallback(({ rowData }) => onOrderSelect(
    !isOrderSelected(rowData.gid),
    rowData.gid,
    rowData.algoID,
  ), [isOrderSelected, onOrderSelect])

  const mappedColumns = useMemo(
    () => columns({
      onOrderSelect,
      isOrderSelected,
      t,
      formatTime,
    }),
    [formatTime, isOrderSelected, onOrderSelect, t],
  )

  return (
    <>
      <p className='table-title'>
        {title}
        :
      </p>
      <VirtualTable
        className='ao-modal-virtual-table'
        data={orders}
        columns={mappedColumns}
        defaultSortBy='createdAt'
        defaultSortDirection='ASC'
        onRowClick={onRowClick}
        rowHeight={40}
      />
    </>
  )
}

AlgoOrdersTable.propTypes = {
  setSelectedOrders: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      gid: PropTypes.string.isRequired,
      algoID: PropTypes.string.isRequired,
    }),
  ),
  selectedOrders: PropTypes.arrayOf(
    PropTypes.shape({
      gid: PropTypes.string.isRequired,
      algoID: PropTypes.string.isRequired,
    }),
  ),
  title: PropTypes.string.isRequired,
}

AlgoOrdersTable.defaultProps = {
  orders: [],
  selectedOrders: [],
}

export default React.memo(AlgoOrdersTable)
