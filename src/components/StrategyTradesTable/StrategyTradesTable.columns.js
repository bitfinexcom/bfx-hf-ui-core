/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue } from '@ufx-ui/core'
import { Icon } from 'react-fa'

import { defaultCellRenderer, formatDate } from '../../util/ui'
import { PRICE_SIG_FIGS } from '../../constants/precision'
import { resultNumber } from '../Backtester/Results/Results.utils'
import { getPositionsHeaders } from './TradesTable/TradesTable.helpers'

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

export default (t, selectedIndex, setSelectedIndex) => {
  const {
    id, entryAt, closedAt, entryPrice, closingPrice, amount, pl,
  } = getPositionsHeaders(t)

  return [
    {
      label: id,
      dataKey: 'id',
      width: 50,
      flexGrow: 1,
      cellRenderer: ({ rowData }) => defaultCellRenderer(`#${rowData?.id}`),
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
      cellRenderer: ({ rowData }) => formatDate(rowData?.entryAt),
    },
    {
      label: closedAt,
      dataKey: 'closedAt',
      width: 180,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData = {} }) => formatDate(rowData?.closedAt),
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
          value={rowData.entryPrice}
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
      cellRenderer: ({ rowData = {} }) => (rowData.closingPrice
        ? defaultCellRenderer(
          <PrettyValue
            value={rowData.closingPrice}
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
          value={rowData?.amount}
          sigFig={PRICE_SIG_FIGS}
          fadeTrailingZeros
        />,
      ),
    },
    {
      label: pl,
      dataKey: 'pl',
      width: 150,
      flexGrow: 1,
      style: STYLES.flexEnd,
      headerStyle: STYLES.flexEnd,
      cellRenderer: ({ rowData }) => resultNumber(rowData?.pl),
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
