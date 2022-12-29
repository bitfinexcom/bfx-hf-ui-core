import React, {
  memo, useState, useCallback, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import AlgoOrdersTableColumns from './AlgoOrdersTable.columns'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'
import AlgoOrderDetailsModal from '../../modals/AlgoOrderDetailsModal'

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
}) => {
  const data = renderedInTradingState ? filteredAlgoOrders : algoOrders
  const { t } = useTranslation()

  // Storing a null or an order ID here, indicates if Edit / Canel modal is opened for a specific row
  const [activeOrderGID, setActiveOrderGID] = useState(null)
  // Indicates if the 'More info' modal is opened for a specific row
  const [moreInfoGID, setMoreInfoGID] = useState(null)

  const closeAlgoOrderDetailsModal = useCallback(
    () => setMoreInfoGID(null),
    [],
  )

  const AOColumns = useMemo(
    () => AlgoOrdersTableColumns({
      authToken,
      cancelOrder,
      gaCancelOrder,
      t,
      getMarketPair,
      editOrder,
      showActions: !showHistory,
      activeOrderGID,
      setActiveOrderGID,
      setMoreInfoGID,
    }),
    [
      activeOrderGID,
      authToken,
      cancelOrder,
      editOrder,
      gaCancelOrder,
      getMarketPair,
      showHistory,
      t,
    ],
  )

  return (
    <div className='hfui-aolist__wrapper'>
      {_isEmpty(data) ? (
        <p className='empty'>
          {t(showHistory ? 'AOTableModal.noHistory' : 'AOTableModal.noOrders')}
        </p>
      ) : (
        <VirtualTable
          data={data}
          columns={AOColumns}
          defaultSortBy='createdAt'
          defaultSortDirection='ASC'
          rowHeight={30}
        />
      )}
      <AlgoOrderDetailsModal
        algoOrderId={moreInfoGID}
        onClose={closeAlgoOrderDetailsModal}
      />
    </div>
  )
}

AlgoOrdersTable.propTypes = {
  algoOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)).isRequired,
  filteredAlgoOrders: PropTypes.objectOf(PropTypes.shape(ORDER_SHAPE)),
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
}

export default memo(AlgoOrdersTable)
