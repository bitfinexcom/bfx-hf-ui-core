import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'

import useSize from '../../hooks/useSize'
import AtomicOrdersTableColumns from './AtomicOrdersTable.columns'
import './style.css'

const AtomicOrdersTable = ({
  atomicOrders, filteredAtomicOrders, renderedInTradingState, cancelOrder, authToken, gaCancelOrder,
}) => {
  const [ref, size] = useSize()
  const data = renderedInTradingState ? filteredAtomicOrders : atomicOrders

  return (
    <div ref={ref} className='hfui-orderstable__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>No active atomic orders</p>
      ) : (
        <VirtualTable
          data={data}
          columns={AtomicOrdersTableColumns(authToken, cancelOrder, gaCancelOrder, size)}
          defaultSortBy='id'
          defaultSortDirection='ASC'
        />
      )}
    </div>
  )
}

AtomicOrdersTable.propTypes = {
  authToken: PropTypes.string.isRequired,
  atomicOrders: PropTypes.arrayOf(PropTypes.object),
  filteredAtomicOrders: PropTypes.arrayOf(PropTypes.object),
  cancelOrder: PropTypes.func.isRequired,
  gaCancelOrder: PropTypes.func.isRequired,
  renderedInTradingState: PropTypes.bool,
}

AtomicOrdersTable.defaultProps = {
  atomicOrders: [],
  filteredAtomicOrders: [],
  renderedInTradingState: false,
}

export default AtomicOrdersTable
