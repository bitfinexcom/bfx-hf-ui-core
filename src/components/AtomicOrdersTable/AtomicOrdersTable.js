import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { getAtomicOrders } from '../OrderForm/OrderForm.orders.helpers'

import useSize from '../../hooks/useSize'
import AtomicOrdersTableColumns from './AtomicOrdersTable.columns'
import './style.css'

const AtomicOrdersTable = ({
  atomicOrders, filteredAtomicOrders, renderedInTradingState,
  cancelOrder, authToken, getMarketPair, editOrder, getIsDerivativePair,
}) => {
  const [ref, size] = useSize()
  const data = renderedInTradingState ? filteredAtomicOrders : atomicOrders
  const { t } = useTranslation()
  const orders = getAtomicOrders(t)
  const columns = useMemo(
    () => AtomicOrdersTableColumns(authToken, cancelOrder, size, t, getMarketPair, editOrder, getIsDerivativePair, orders),
    [authToken, cancelOrder, getMarketPair, size, t, editOrder, getIsDerivativePair, orders],
  )

  return (
    <div ref={ref} className='hfui-orderstable__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>{t('atomicOrdersTableModal.noOrders')}</p>
      ) : (
        <VirtualTable
          data={data}
          columns={columns}
          defaultSortBy='created'
          defaultSortDirection='DESC'
        />
      )}
    </div>
  )
}

AtomicOrdersTable.propTypes = {
  authToken: PropTypes.string.isRequired,
  atomicOrders: PropTypes.objectOf(PropTypes.object),
  filteredAtomicOrders: PropTypes.objectOf(PropTypes.object),
  getMarketPair: PropTypes.func.isRequired,
  cancelOrder: PropTypes.func.isRequired,
  editOrder: PropTypes.func.isRequired,
  renderedInTradingState: PropTypes.bool,
  getIsDerivativePair: PropTypes.func.isRequired,
}

AtomicOrdersTable.defaultProps = {
  atomicOrders: [],
  filteredAtomicOrders: [],
  renderedInTradingState: false,
}

export default AtomicOrdersTable
