import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _size from 'lodash/size'
import _filter from 'lodash/filter'
import _toString from 'lodash/toString'
import _values from 'lodash/values'
import _isEmpty from 'lodash/isEmpty'
import { OrderHistory as UfxOrderHistory, Spinner } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Modal from '../../ui/Modal'
import { getOrderDetails } from './AlgoOrderDetailsModal.utils'
import {
  getAlgoOrderById,
  getAtomicOrders,
  getOrderHistory,
} from '../../redux/selectors/ws'
import { getMarketPair as _getMarketPair } from '../../redux/selectors/meta'
import { getAOContext } from '../../util/order'
import { saveAsJSON } from '../../util/ui'
import { rowMapping } from '../../components/OrderHistory/OrderHistory.colunms'
import Scrollbars from '../../ui/Scrollbars'
import PanelIconButton from '../../ui/Panel/Panel.IconButton'

import './style.css'

const AlgoOrderDetailsModal = ({ onClose, algoOrderId }) => {
  const { t } = useTranslation()

  const isOpen = !!algoOrderId

  const atomicOrders = useSelector(getAtomicOrders)
  const orders = useSelector(getOrderHistory)
  const getMarketPair = useSelector(_getMarketPair)
  const rowData = useSelector(getAlgoOrderById(algoOrderId))

  const orderDetails = useMemo(() => getOrderDetails(rowData, t), [rowData, t])
  const detailsSize = _size(orderDetails)
  const filteredAtomics = _filter(
    _values(atomicOrders),
    (atomicOrder) => _toString(atomicOrder.gid) === _toString(rowData?.gid),
  )
  const mappedAtomics = _map(filteredAtomics, (order) => ({
    ...order,
    pair: getMarketPair(order.symbol),
  }))
  const filteredOrders = [
    ...mappedAtomics,
    ..._filter(
      orders,
      (order) => _toString(order.gid) === _toString(rowData?.gid),
    ),
  ]

  const handleSave = useCallback(
    (name, gid) => {
      saveAsJSON(orders, `algo-${name}-${gid}`)
    },
    [orders],
  )

  if (isOpen && _isEmpty(rowData)) {
    return <Spinner />
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      title={(
        <div className='title-container'>
          <div className='hfui-navbar__layout-settings__title'>
            {rowData?.name}
            <span className='sub-title'>{rowData?.alias}</span>
          </div>
          <PanelIconButton
            onClick={onClose}
            icon={<i className='icon-cancel' />}
          />
        </div>
      )}
      className='hfui-ao-details-modal'
      height={460}
      width={1200}
      isCloseButtonShown={false}
    >
      <div className='basic-info'>
        <div className='info-col'>
          <span className='info-label'>{t('table.created')}</span>
          {' '}
          <span className='info-value'>
            {new Date(rowData?.createdAt || +rowData?.gid).toLocaleString()}
          </span>
        </div>
        <div className='info-col'>
          <span className='info-label'>{t('table.symbol')}</span>
          {' '}
          <span className='info-value'>{getMarketPair(rowData?.args?.symbol)}</span>
        </div>
        <div className='info-col'>
          <span className='info-label'>{t('table.context')}</span>
          {' '}
          <span className='info-value'>{getAOContext(rowData)}</span>
        </div>
        <div className='info-col'>
          <span className='info-label'>{t('table.label')}</span>
          {' '}
          <span className='info-value'>{rowData?.label}</span>
        </div>
      </div>
      <p className='info-title'>{t('table.orderDetails')}</p>
      <div className='basic-info'>
        {_map(orderDetails, ({ label, value }, index) => (
          <div className='info-col' key={label}>
            <span className='info-label'>{label}</span>
            =
            <span className='info-value'>{value}</span>
            {index !== detailsSize - 1 && ', '}
          </div>
        ))}
      </div>
      <div className='order-history'>
        <p className='order-history_title'>{t('table.atomicHistory')}</p>
        <div
          className='order-history_button'
          onClick={() => handleSave(rowData?.name, rowData?.gid)}
        >
          {t('table.exportJSON')}
        </div>
      </div>
      <div className='order-history-table'>
        <Scrollbars>
          <UfxOrderHistory
            orders={filteredOrders}
            rowMapping={rowMapping}
            isMobileLayout={false}
            loadMoreRows={() => {}}
          />
        </Scrollbars>
      </div>
    </Modal>
  )
}

AlgoOrderDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  algoOrderId: PropTypes.string,
}

AlgoOrderDetailsModal.defaultProps = {
  algoOrderId: null,
}

export default AlgoOrderDetailsModal
