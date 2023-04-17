/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue } from '@ufx-ui/core'
import { Icon } from 'react-fa'

import { defaultCellRenderer } from '../../util/ui'
import { PRICE_SIG_FIGS } from '../../constants/precision'
import resultNumber from '../../util/resultNumber'
import { getPositionsHeaders } from './TradesTable/TradesTable.helpers'
import {
  getPositionEntryAt, getPositionClosedAt, getPositionEntryPrice, getPositionClosingPrice,
  getPositionAmount, getPositionPl, getPositionId,
} from './StrategyTradesTable.helpers'

const STYLES = {
  flexStart: { justifyContent: 'flex-start' },
  flexEnd: { justifyContent: 'flex-end' },
  center: { justifyContent: 'center' },
}

const RowExpandCell = ({ children, index, setSelectedIndex }) => (
  <div style={{ cursor: 'pointer' }} onClick={() => setSelectedIndex(index)}>
    {children}
  </div>
)

export default ({
  t, selectedIndex, setSelectedIndex, formatTime,
}) => {
  const {
    id, entryAt, closedAt, entryPrice, closingPrice, amount, realizedPnl,
  } = getPositionsHeaders(t)

  return [
    {
      label: id,
      dataKey: 'id',
      width: 50,
      flexGrow: 1,
      cellRenderer: ({ rowData }) => defaultCellRenderer(`#${getPositionId(rowData)}`),
      style: STYLES.flexStart,
      headerStyle: STYLES.flexStart,
    },
    {
      label: entryAt,
      dataKey: 'entryAt',
      width: 180,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData }) => getPositionEntryAt(rowData, formatTime),
    },
    {
      label: closedAt,
      dataKey: 'closedAt',
      width: 180,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData = {} }) => getPositionClosedAt(rowData, formatTime),
    },
    {
      label: entryPrice,
      dataKey: 'entryPrice',
      width: 150,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
        <PrettyValue
          value={getPositionEntryPrice(rowData)}
          sigFig={PRICE_SIG_FIGS}
          fadeTrailingZeros
        />,
      ),
    },
    {
      label: closingPrice,
      dataKey: 'closingPrice',
      width: 150,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData = {} }) => (getPositionClosingPrice(rowData)
        ? defaultCellRenderer(
          <PrettyValue
            value={getPositionClosingPrice(rowData)}
            sigFig={PRICE_SIG_FIGS}
            fadeTrailingZeros
          />,
        ) : '--'),
    },
    {
      label: amount,
      dataKey: 'amount',
      width: 150,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData }) => defaultCellRenderer(
        <PrettyValue
          value={getPositionAmount(rowData)}
          sigFig={PRICE_SIG_FIGS}
          fadeTrailingZeros
        />,
      ),
    },
    {
      label: realizedPnl,
      dataKey: 'pl',
      width: 150,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData }) => resultNumber(getPositionPl(rowData)),
    },
    // {
    //   label: t('table.drawdown'),
    //   dataKey: 'drawdown',
    //   width: 150,
    //   flexGrow: 1,
    //   style: STYLES.flexEnd,
    //   headerStyle: STYLES.flexEnd,
    //   cellRenderer: () => resultNumber(),
    // },
    {
      label: '',
      cellDataGetter: ({ rowData }) => rowData.length,
      dataKey: 'index',
      width: 100,
      flexGrow: 1.5,
      disableSort: true,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowIndex }) => {
        if (rowIndex !== selectedIndex) {
          return (
            <RowExpandCell index={rowIndex} setSelectedIndex={setSelectedIndex}>
              <Icon name='plus' />
              {' '}
              {t('table.viewTrades')}
            </RowExpandCell>
          )
        }
        return (
          <RowExpandCell index={-1} setSelectedIndex={setSelectedIndex}>
            <Icon name='minus' />
            {' '}
            {t('table.viewTrades')}
          </RowExpandCell>
        )
      },
    },
  ]
}
