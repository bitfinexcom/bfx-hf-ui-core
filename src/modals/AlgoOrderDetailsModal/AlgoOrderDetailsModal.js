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
import { useDispatch, useSelector } from 'react-redux'
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
import getRowMapping from '../../components/OrderHistory/OrderHistory.columns'
import Scrollbars from '../../ui/Scrollbars'
import AlgoOrderDetailsModalHeader from './AlgoOrderDetailsModal.Header'
import { getComponentState, getFormatTimeFn, getUIState } from '../../redux/selectors/ui'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import UIActions from '../../redux/actions/ui'
import { getFailedRecurringAOAtomics } from '../../redux/selectors/ao'

import './style.css'

const COMPONENT_ID = 'AO_DETAILS_MODAL'

const AlgoOrderDetailsModal = ({ onClose, algoOrderId, isOpen }) => {
  const { t } = useTranslation()

  const atomicOrders = useSelector(getAtomicOrders)
  const orders = useSelector(getOrderHistory)
  const getMarketPair = useSelector(_getMarketPair)
  const rowData = useSelector(getAlgoOrderById(algoOrderId))
  const formatTime = useSelector(getFormatTimeFn)
  const layoutID = useSelector((state) => getUIState(state, UI_KEYS.layoutID))
  const tableState = useSelector((state) => getComponentState(state, layoutID, null, COMPONENT_ID),
  )
  const failedOrders = useSelector(getFailedRecurringAOAtomics)

  const orderDetails = useMemo(
    () => getOrderDetails(rowData, t, formatTime),
    [rowData, t, formatTime],
  )
  const detailsSize = _size(orderDetails)
  const filteredAtomics = _filter(
    _values(atomicOrders),
    (atomicOrder) => _toString(atomicOrder.gid) === _toString(rowData?.gid),
  )
  const mappedAtomics = _map(filteredAtomics, (order) => ({
    ...order,
    pair: getMarketPair(order.symbol),
  }))
  const filteredOrders = useMemo(
    () => [
      ...mappedAtomics,
      ..._filter(
        orders,
        (order) => _toString(order.gid) === _toString(rowData?.gid),
      ),
      ..._filter(
        failedOrders,
        (order) => _toString(order.gid) === _toString(rowData?.gid),
      ),
    ],
    [mappedAtomics, orders, failedOrders, rowData?.gid],
  )

  const orderHistoryMapping = useMemo(
    () => getRowMapping(formatTime),
    [formatTime],
  )

  const dispatch = useDispatch()

  const handleSave = useCallback(
    (name, gid) => {
      saveAsJSON(filteredOrders, `algo-${name}-${gid}`)
    },
    [filteredOrders],
  )

  const updateTableState = (state) => {
    dispatch(
      UIActions.updateComponentState({
        state,
        layoutID,
        componentID: COMPONENT_ID,
      }),
    )
  }

  if (isOpen && _isEmpty(rowData)) {
    return <Spinner />
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={isOpen}
      title={
        <AlgoOrderDetailsModalHeader rowData={rowData} onClose={onClose} />
      }
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
            {formatTime(rowData?.createdAt || +rowData?.gid)}
          </span>
        </div>
        <div className='info-col'>
          <span className='info-label'>{t('table.symbol')}</span>
          {' '}
          <span className='info-value'>
            {getMarketPair(rowData?.args?.symbol)}
          </span>
        </div>
        <div className='info-col'>
          <span className='info-label'>{t('table.context')}</span>
          {' '}
          <span className='info-value'>{getAOContext(rowData)}</span>
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
            rowMapping={orderHistoryMapping}
            isMobileLayout={false}
            loadMoreRows={() => {}}
            tableState={tableState}
            updateTableState={updateTableState}
          />
        </Scrollbars>
      </div>
    </Modal>
  )
}

AlgoOrderDetailsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  algoOrderId: PropTypes.string,
  isOpen: PropTypes.bool.isRequired,
}

AlgoOrderDetailsModal.defaultProps = {
  algoOrderId: null,
}

export default AlgoOrderDetailsModal
