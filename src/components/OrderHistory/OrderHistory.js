import React from 'react'
import PropTypes from 'prop-types'

import _isEmpty from 'lodash/isEmpty'
import {
  OrderHistory as UfxOrderHistory,
} from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import Panel from '../../ui/Panel'
import useSize from '../../hooks/useSize'
import { ROW_MAPPING } from './OrderHistory.colunms'
import './style.css'

const OrderHistory = ({
  onRemove, dark, orders,
}) => {
  const [ref, { width }] = useSize()
  const { t } = useTranslation()

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
            rowMapping={ROW_MAPPING}
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
}

OrderHistory.defaultProps = {
  onRemove: () => { },
  dark: true,
  orders: [],
}

export default OrderHistory
