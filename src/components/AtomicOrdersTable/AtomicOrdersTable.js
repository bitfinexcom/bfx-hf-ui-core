import React from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import useSize from '../../hooks/useSize'
import AtomicOrdersTableColumns from './AtomicOrdersTable.columns'
import './style.css'

const AtomicOrdersTable = ({
  atomicOrders, filteredAtomicOrders, renderedInTradingState, cancelOrder, authToken, gaCancelOrder,
}) => {
  const [ref, size] = useSize()
  const data = renderedInTradingState ? filteredAtomicOrders : atomicOrders
  const { t } = useTranslation()

  return (
    <div ref={ref} className='hfui-orderstable__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>{t('atomicOrdersTableModal.noOrders')}</p>
      ) : (
        <VirtualTable
          data={data}
          columns={AtomicOrdersTableColumns(authToken, cancelOrder, gaCancelOrder, size, t)}
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
