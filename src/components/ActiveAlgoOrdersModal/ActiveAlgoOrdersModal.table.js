import React from 'react'
import PropTypes from 'prop-types'
import { VirtualTable, Checkbox } from '@ufx-ui/core'

import columns from './ActiveAlgoOrdersModal.columns'

import './style.css'

const AlgoOrdersTable = ({
  orders,
  onOrderSelect,
  isOrderSelected,
  onAllOrdersSelect,
  isAllOrdersSelected,
}) => (
  <>
    <VirtualTable
      className='ao-modal-virtual-table'
      data={orders}
      columns={columns(onOrderSelect, isOrderSelected)}
      defaultSortBy='gid'
      defaultSortDirection='ASC'
      onRowClick={({ rowData }) => onOrderSelect(!isOrderSelected(rowData.gid), rowData.gid, rowData.algoID)}
      rowHeight={40}
    />
    <Checkbox
      className='select-all'
      label='Select All'
      checked={isAllOrdersSelected()}
      onChange={e => onAllOrdersSelect(e)}
    />
  </>
)

AlgoOrdersTable.propTypes = {
  isOrderSelected: PropTypes.func,
  isAllOrdersSelected: PropTypes.func,
  onOrderSelect: PropTypes.func.isRequired,
  orders: PropTypes.arrayOf(PropTypes.object),
  onAllOrdersSelect: PropTypes.func.isRequired,
}

AlgoOrdersTable.defaultProps = {
  orders: [],
  isOrderSelected: () => false,
  isAllOrdersSelected: () => false,
}

export default React.memo(AlgoOrdersTable)
