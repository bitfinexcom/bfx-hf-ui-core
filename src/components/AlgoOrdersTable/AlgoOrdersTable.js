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
  renderedInTradingState,
  getMarketPair,
  showHistory,
  formatTime,
}) => {
  const data = renderedInTradingState ? filteredAlgoOrders : algoOrders
  const { t } = useTranslation()

  // Indicates if the 'More info' modal is opened for a specific row
  const [moreInfoGID, setMoreInfoGID] = useState(null)

  const closeAlgoOrderDetailsModal = useCallback(
    () => setMoreInfoGID(null),
    [],
  )

  const AOColumns = useMemo(
    () => AlgoOrdersTableColumns({
      t,
      getMarketPair,
      isHistoryView: showHistory,
      setMoreInfoGID,
      formatTime,
    }),
    [getMarketPair, showHistory, t, formatTime],
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
          defaultSortBy='lastActive'
          defaultSortDirection='DESC'
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
  renderedInTradingState: PropTypes.bool,
  getMarketPair: PropTypes.func.isRequired,
  showHistory: PropTypes.bool.isRequired,
  formatTime: PropTypes.func.isRequired,
}

AlgoOrdersTable.defaultProps = {
  filteredAlgoOrders: {},
  renderedInTradingState: false,
}

export default memo(AlgoOrdersTable)
