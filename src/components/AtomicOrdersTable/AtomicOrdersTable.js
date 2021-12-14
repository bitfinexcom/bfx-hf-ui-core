import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _filter from 'lodash/filter'
import _keys from 'lodash/keys'
import _reduce from 'lodash/reduce'
import _isUndefined from 'lodash/isUndefined'
import { VirtualTable } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import useSize from '../../hooks/useSize'
import AtomicOrdersTableColumns from './AtomicOrdersTable.columns'
import './style.css'

const AtomicOrdersTable = ({
  atomicOrders, filteredAtomicOrders, renderedInTradingState,
  cancelOrder, authToken, gaCancelOrder, getMarketPair, editOrder, markets,
}) => {
  const [ref, size] = useSize()
  const data = useMemo(() => {
    const orders = renderedInTradingState ? filteredAtomicOrders : atomicOrders
    const filtered = _filter(_keys(orders), (key) => !_isUndefined(markets[orders[key]?.symbol]))
    return _reduce(filtered, (res, key) => ({ ...res, [key]: orders[key] }), {})
  }, [renderedInTradingState, filteredAtomicOrders, atomicOrders, markets])

  const { t } = useTranslation()
  const columns = useMemo(
    () => AtomicOrdersTableColumns(authToken, cancelOrder, gaCancelOrder, size, t, getMarketPair, editOrder),
    [authToken, cancelOrder, gaCancelOrder, getMarketPair, size, t, editOrder],
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
  gaCancelOrder: PropTypes.func.isRequired,
  editOrder: PropTypes.func.isRequired,
  renderedInTradingState: PropTypes.bool,
  markets: PropTypes.objectOf(PropTypes.object).isRequired,
}

AtomicOrdersTable.defaultProps = {
  atomicOrders: [],
  filteredAtomicOrders: [],
  renderedInTradingState: false,
}

export default AtomicOrdersTable
