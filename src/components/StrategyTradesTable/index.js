import React, { memo } from 'react'
import { VirtualTable } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Panel from '../../ui/Panel'
import StrategyTradesTableColumns from './StrategyTradesTable.columns'

import './style.css'

const StrategyTradesTable = ({ results: { trades }, onTradeClick, dark }) => {
  const { t } = useTranslation()

  return (
    <Panel
      dark={dark}
      darkHeader={dark}
      label={t('tradesTableModal.title')}
      removeable={false}
      moveable
      className='hfui-strategytradestable__wrapper'
    >
      {_isEmpty(trades) ? (
        <div className='no-trades__wrapper'>
          <span className='no-trades__notification'>
            {t('tradesTableModal.noTrades')}
          </span>
        </div>
      ) : (
        <VirtualTable
          data={trades}
          columns={StrategyTradesTableColumns(t)}
          defaultSortBy='mts'
          defaultSortDirection='DESC'
          onRowClick={({ rowData }) => onTradeClick(rowData)}
        />
      )}
    </Panel>
  )
}

StrategyTradesTable.propTypes = {
  results: PropTypes.shape({
    trades: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  }).isRequired,
  onTradeClick: PropTypes.func.isRequired,
  dark: PropTypes.bool,
}

StrategyTradesTable.defaultProps = {
  dark: true,
}

export default memo(StrategyTradesTable)
