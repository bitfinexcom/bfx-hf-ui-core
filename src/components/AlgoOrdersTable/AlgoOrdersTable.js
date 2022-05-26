import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import AlgoOrdersTableColumns from './AlgoOrdersTable.columns'
import './style.css'

const AlgoOrdersTable = ({
  filteredAlgoOrders, algoOrders, cancelOrder, authToken, gaCancelOrder, renderedInTradingState, getMarketPair, editOrder,
}) => {
  const data = renderedInTradingState ? filteredAlgoOrders : algoOrders
  const { t } = useTranslation()

  return (
    <div className='hfui-aolist__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>{t('AOTableModal.noOrders')}</p>
      ) : (
        <VirtualTable
          data={data}
          columns={AlgoOrdersTableColumns(authToken, cancelOrder, gaCancelOrder, t, getMarketPair, editOrder)}
          defaultSortBy='createdAt'
          defaultSortDirection='ASC'
          rowHeight={30}
        />
      )}
    </div>
  )
}

AlgoOrdersTable.propTypes = {
  algoOrders: PropTypes.objectOf(PropTypes.object), // eslint-disable-line
  filteredAlgoOrders: PropTypes.objectOf(PropTypes.object), // eslint-disable-line
  cancelOrder: PropTypes.func.isRequired,
  gaCancelOrder: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  renderedInTradingState: PropTypes.bool,
  getMarketPair: PropTypes.func.isRequired,
  editOrder: PropTypes.func.isRequired,
}

AlgoOrdersTable.defaultProps = {
  algoOrders: {},
  filteredAlgoOrders: {},
  renderedInTradingState: false,
}

export default memo(AlgoOrdersTable)
