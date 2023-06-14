import React, { useEffect, useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'

import _isEmpty from 'lodash/isEmpty'
import { OrderHistory as UfxOrderHistory, Spinner } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import Panel from '../../ui/Panel'
import useSize from '../../hooks/useSize'
import getRowMapping from './OrderHistory.columns'
import { getNextEndDate } from './OrderHistory.helpers'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const OrderHistory = ({
  onRemove,
  dark,
  orders,
  fetchOrderHistory,
  authToken,
  setIsLoadingOrderHistFlag,
  isLoadingOrderHistData,
  apiCredentials,
  currentMode,
  formatTime,
  updateState,
  savedState,
}) => {
  const [ref, { width }] = useSize()
  const { t } = useTranslation()

  const orderHistoryMapping = useMemo(() => getRowMapping(formatTime), [formatTime])

  const fetchMoreItems = useCallback(() => {
    fetchOrderHistory(authToken, getNextEndDate(orders))
  }, [authToken, fetchOrderHistory, orders])

  const handleLoadMoreRows = () => {
    setIsLoadingOrderHistFlag(true)
    fetchMoreItems()
  }

  const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid

  // fetch on change of currentMode or apiClientConfigured
  useEffect(() => {
    if (apiClientConfigured) {
      fetchOrderHistory(authToken)
    }
  }, [apiClientConfigured, authToken, fetchOrderHistory, currentMode])

  return (
    <Panel
      label={t('orderHistoryModal.title')}
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
      extraIcons={isLoadingOrderHistData && <Spinner />}
      className='orderhistroy__panel'
    >
      <div ref={ref} className='orderhistroy__wrapper'>
        {_isEmpty(orders) ? (
          <p className='empty'>{t('orderHistoryModal.noHistory')}</p>
        ) : (
          <UfxOrderHistory
            orders={orders}
            rowMapping={orderHistoryMapping}
            isMobileLayout={width < 700}
            loadMoreRows={handleLoadMoreRows}
            tableState={savedState}
            updateTableState={updateState}
          />
        )}
      </div>
    </Panel>
  )
}

OrderHistory.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.shape(ORDER_SHAPE)),
  dark: PropTypes.bool,
  onRemove: PropTypes.func,
  fetchOrderHistory: PropTypes.func.isRequired,
  setIsLoadingOrderHistFlag: PropTypes.func.isRequired,
  authToken: PropTypes.string,
  isLoadingOrderHistData: PropTypes.bool,
  apiCredentials: PropTypes.objectOf(PropTypes.bool),
  currentMode: PropTypes.string.isRequired,
  formatTime: PropTypes.func.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  savedState: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
}

OrderHistory.defaultProps = {
  onRemove: () => {},
  dark: true,
  orders: [],
  authToken: '',
  isLoadingOrderHistData: false,
  apiCredentials: {},
}

export default OrderHistory
