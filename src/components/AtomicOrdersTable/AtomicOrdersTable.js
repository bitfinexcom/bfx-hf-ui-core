import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { getAtomicOrders } from '../OrderForm/OrderForm.orders.helpers'

import useSize from '../../hooks/useSize'
import AtomicOrdersTableColumns from './AtomicOrdersTable.columns'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const AtomicOrdersTable = ({
  atomicOrders,
  filteredAtomicOrders,
  renderedInTradingState,
  cancelOrder,
  authToken,
  getMarketPair,
  editOrder,
  getIsDerivativePair,
  formatTime,
  tableState,
  updateTableState,
}) => {
  const [ref, size] = useSize()
  const data = renderedInTradingState ? filteredAtomicOrders : atomicOrders
  const { i18n, t } = useTranslation()
  const orders = getAtomicOrders(t)
  const columns = useMemo(
    () => AtomicOrdersTableColumns({
      authToken,
      cancelOrder,
      size,
      i18n,
      t,
      getMarketPair,
      editOrder,
      getIsDerivativePair,
      formatTime,
      orders,
    }),
    [
      authToken,
      cancelOrder,
      getMarketPair,
      size,
      i18n,
      t,
      editOrder,
      getIsDerivativePair,
      formatTime,
      orders,
    ],
  )

  return (
    <div ref={ref} className='hfui-orderstable__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>{t('atomicOrdersTableModal.noOrders')}</p>
      ) : (
        <VirtualTable
          data={data}
          columns={columns}
          tableState={tableState}
          updateTableState={updateTableState}
          defaultSortBy='created'
          defaultSortDirection='DESC'
        />
      )}
    </div>
  )
}

AtomicOrdersTable.propTypes = {
  authToken: PropTypes.string.isRequired,
  atomicOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)),
  filteredAtomicOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)),
  getMarketPair: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  editOrder: PropTypes.func.isRequired,
  renderedInTradingState: PropTypes.bool,
  getIsDerivativePair: PropTypes.func.isRequired,
  formatTime: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  tableState: PropTypes.object.isRequired,
  updateTableState: PropTypes.func.isRequired,
}

AtomicOrdersTable.defaultProps = {
  atomicOrders: [],
  filteredAtomicOrders: [],
  renderedInTradingState: false,
}

export default AtomicOrdersTable
