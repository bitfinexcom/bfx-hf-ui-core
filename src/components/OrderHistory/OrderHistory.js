import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import _isEmpty from 'lodash/isEmpty'
import {
  OrderHistory as UfxOrderHistory,
} from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import Panel from '../../ui/Panel'
import useSize from '../../hooks/useSize'
import { getRowMapping } from './OrderHistory.colunms'
import './style.css'

const OrderHistory = ({
  onRemove, dark, orders, getMarketPair,
}) => {
  const [ref, { width }] = useSize()
  const { t } = useTranslation()
  const columns = useMemo(() => getRowMapping(getMarketPair), [getMarketPair])

  return (
    <Panel
      label={t('orderHistoryModal.title')}
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
    >
      <div ref={ref}>
        {_isEmpty(orders) ? (
          <p className='empty'>{t('orderHistoryModal.noHistory')}</p>
        ) : (
          <UfxOrderHistory
            orders={orders}
            rowMapping={columns}
            isMobileLayout={width < 700}
          />
        )}
      </div>
    </Panel>
  )
}

OrderHistory.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object),
  dark: PropTypes.bool,
  onRemove: PropTypes.func,
  getMarketPair: PropTypes.func.isRequired,
}

OrderHistory.defaultProps = {
  onRemove: () => { },
  dark: true,
  orders: [],
}

export default OrderHistory
