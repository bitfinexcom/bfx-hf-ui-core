import React, { Fragment } from 'react'
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
  <Fragment className='hfui-active-ao-modal__table'>
    <VirtualTable
      className='virtual-table'
      data={orders}
      columns={columns(onOrderSelect, isOrderSelected)}
      defaultSortBy='gid'
      defaultSortDirection='ASC'
      rowHeight={30}
    />
    <Checkbox
      label='Select All'
      checked={isAllOrdersSelected()}
      onChange={e => onAllOrdersSelect(e)}
    />
  </Fragment>
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
