import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import AlgoOrdersTableColumns from './AlgoOrdersTable.columns'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const AlgoOrdersTable = ({
  filteredAlgoOrders,
  algoOrders,
  cancelOrder,
  authToken,
  gaCancelOrder,
  renderedInTradingState,
  getMarketPair,
  editOrder,
  showHistory,
  orders,
}) => {
  const data = renderedInTradingState ? filteredAlgoOrders : algoOrders
  const { t } = useTranslation()

  console.log(orders)

  // Storing a null or an order ID here, indicates if Edit / Canel modal is opened for a specific row
  const [activeOrderGID, setActiveOrderGID] = useState(null)
  // Indicates if the 'More info' modal is opened for a specific row
  const [moreInfoGID, setMoreInfoGID] = useState(null)

  return (
    <div className='hfui-aolist__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>
          {t(showHistory ? 'AOTableModal.noHistory' : 'AOTableModal.noOrders')}
        </p>
      ) : (
        <VirtualTable
          data={data}
          columns={AlgoOrdersTableColumns({
            authToken,
            cancelOrder,
            gaCancelOrder,
            t,
            getMarketPair,
            editOrder,
            showActions: !showHistory,
            activeOrderGID,
            setActiveOrderGID,
            moreInfoGID,
            setMoreInfoGID,
            orders,
          })}
          defaultSortBy='createdAt'
          defaultSortDirection='ASC'
          rowHeight={30}
        />
      )}
    </div>
  )
}

AlgoOrdersTable.propTypes = {
  algoOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)).isRequired,
  filteredAlgoOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)),
  orders: PropTypes.arrayOf(PropTypes.shape(ORDER_SHAPE)),
  cancelOrder: PropTypes.func.isRequired,
  gaCancelOrder: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  renderedInTradingState: PropTypes.bool,
  getMarketPair: PropTypes.func.isRequired,
  editOrder: PropTypes.func.isRequired,
  showHistory: PropTypes.bool.isRequired,
}

AlgoOrdersTable.defaultProps = {
  filteredAlgoOrders: {},
  renderedInTradingState: false,
  orders: [],
}

export default memo(AlgoOrdersTable)
