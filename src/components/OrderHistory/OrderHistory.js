import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import _isEmpty from 'lodash/isEmpty'
import {
  OrderHistory as UfxOrderHistory, Spinner,
} from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import Panel from '../../ui/Panel'
import useSize from '../../hooks/useSize'
import { rowMapping } from './OrderHistory.colunms'
import { getNextEndDate } from './OrderHistory.helpers'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const OrderHistory = ({
  onRemove, dark, orders, fetchOrderHistory, authToken, setIsLoadingOrderHistFlag,
  isLoadingOrderHistData, apiCredentials,
}) => {
  const [ref, { width }] = useSize()
  const { t } = useTranslation()

  const fetchMoreItems = useCallback(() => {
    fetchOrderHistory(authToken, getNextEndDate(orders))
  }, [authToken, fetchOrderHistory, orders])

  const handleLoadMoreRows = () => {
    setIsLoadingOrderHistFlag(true)
    fetchMoreItems({ fetchMoreItems: true })
  }

  const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid

  useEffect(() => {
    if (apiClientConfigured) {
      fetchOrderHistory(authToken)
    }
  }, [apiClientConfigured, authToken, fetchOrderHistory])

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
            rowMapping={rowMapping}
            isMobileLayout={width < 700}
            loadMoreRows={handleLoadMoreRows}
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
}

OrderHistory.defaultProps = {
  onRemove: () => { },
  dark: true,
  orders: [],
  authToken: '',
  isLoadingOrderHistData: false,
  apiCredentials: {},
}

export default OrderHistory
