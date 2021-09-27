import React from 'react'
import PropTypes from 'prop-types'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'

import AlgoOrdersTableColumns from './AlgoOrdersTable.columns'
import './style.css'

const AlgoOrdersTable = ({
  filteredAlgoOrders, algoOrders, cancelOrder, authToken, gaCancelOrder, renderedInTradingState,
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
          columns={AlgoOrdersTableColumns(authToken, cancelOrder, gaCancelOrder, t)}
          defaultSortBy='gid'
          defaultSortDirection='ASC'
          rowHeight={30}
        />
      )}
    </div>
  )
}

AlgoOrdersTable.propTypes = {
  algoOrders: PropTypes.arrayOf(PropTypes.object),
  filteredAlgoOrders: PropTypes.arrayOf(PropTypes.object),
  cancelOrder: PropTypes.func.isRequired,
  gaCancelOrder: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired,
  renderedInTradingState: PropTypes.bool,
}

AlgoOrdersTable.defaultProps = {
  algoOrders: [],
  filteredAlgoOrders: [],
  renderedInTradingState: false,
}

export default React.memo(AlgoOrdersTable)
