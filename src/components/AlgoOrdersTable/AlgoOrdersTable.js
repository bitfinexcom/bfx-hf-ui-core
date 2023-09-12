import React, {
  memo, useState, useCallback, useMemo,
} from 'react'
import PropTypes from 'prop-types'
import _delay from 'lodash/delay'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import AlgoOrdersTableColumns from './AlgoOrdersTable.columns'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'
import AlgoOrderDetailsModal from '../../modals/AlgoOrderDetailsModal'
import useToggle from '../../hooks/useToggle'

import './style.css'

const AlgoOrdersTable = ({
  filteredAlgoOrders,
  algoOrders,
  renderedInTradingState,
  getMarketPair,
  showHistory,
  formatTime,
  tableState,
  updateTableState,
}) => {
  const data = renderedInTradingState ? filteredAlgoOrders : algoOrders
  const { t } = useTranslation()

  const [activeAlgoOrder, setActiveAlgoOrder] = useState(null)
  const [isDetailsModalOpen,, openDetailsModal, closeDetailsModal] = useToggle(false)

  const closeAlgoOrderDetailsModal = useCallback(
    () => {
      closeDetailsModal()
      _delay(setActiveAlgoOrder, 500, null)
    },
    [closeDetailsModal],
  )

  const openAlgoOrderDetailsModal = useCallback((algoOrderId) => {
    setActiveAlgoOrder(algoOrderId)
    openDetailsModal()
  }, [openDetailsModal])

  const AOColumns = useMemo(
    () => AlgoOrdersTableColumns({
      t,
      getMarketPair,
      isHistoryView: showHistory,
      openAlgoOrderDetailsModal,
      formatTime,
    }),
    [getMarketPair, showHistory, t, formatTime, openAlgoOrderDetailsModal],
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
          tableState={tableState}
          updateTableState={updateTableState}
          defaultSortBy='lastActive'
          defaultSortDirection='DESC'
          rowHeight={30}
        />
      )}
      <AlgoOrderDetailsModal
        algoOrderId={activeAlgoOrder}
        onClose={closeAlgoOrderDetailsModal}
        isOpen={isDetailsModalOpen}
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
  // eslint-disable-next-line react/forbid-prop-types
  tableState: PropTypes.object.isRequired,
  updateTableState: PropTypes.func.isRequired,
}

AlgoOrdersTable.defaultProps = {
  filteredAlgoOrders: {},
  renderedInTradingState: false,
}

export default memo(AlgoOrdersTable)
