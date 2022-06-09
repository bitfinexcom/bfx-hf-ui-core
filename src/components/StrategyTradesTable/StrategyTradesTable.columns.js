/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue } from '@ufx-ui/core'
import { defaultTableRowRenderer } from 'react-virtualized'
import { Icon } from 'react-fa'

import { defaultCellRenderer } from '../../util/ui'
import { PRICE_SIG_FIGS } from '../../constants/precision'
import { resultNumber } from '../Backtester/Results/Results.utils'
import TradesTable from './TradesTable'

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

export default (t, selectedIndex, setSelectedIndex) => [
  {
    label: t('table.id'),
    dataKey: 'id',
    width: 50,
    flexGrow: 1,
    cellRenderer: ({ rowData }) => defaultCellRenderer(`#${rowData?.id}`),
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.entryAt'),
    dataKey: 'entryAt',
    width: 180,
    flexGrow: 1,
    style: STYLES.flexEnd,
    headerStyle: STYLES.flexEnd,
    cellRenderer: ({ rowData }) => defaultCellRenderer(new Date(rowData?.entryAt).toLocaleString()),
  },
  {
    label: t('table.leftAt'),
    dataKey: 'closedAt',
    width: 180,
    flexGrow: 1,
    style: STYLES.flexEnd,
    headerStyle: STYLES.flexEnd,
    cellRenderer: ({ rowData = {} }) => (rowData.closedAt ? defaultCellRenderer(new Date(rowData.closedAt).toLocaleString()) : '--'),
  },
  {
    label: t('table.entryPrice'),
    dataKey: 'entryPrice',
    width: 150,
    flexGrow: 1,
    style: STYLES.flexEnd,
    headerStyle: STYLES.flexEnd,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
      <PrettyValue
        value={rowData.price}
        sigFig={PRICE_SIG_FIGS}
        fadeTrailingZeros
      />,
    ),
  },
  {
    label: t('table.closingPrice'),
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
    label: t('table.units'),
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
    label: t('table.position'),
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

export const getRowRenderer = (selectedIndex) => props => {
  const {
    index, style, className, key, rowData,
  } = props
  if (index === selectedIndex) {
    return (
      <div
        style={{ ...style, display: 'flex', flexDirection: 'column' }}
        className={`${className} selected`}
        key={key}
      >
        {defaultTableRowRenderer({
          ...props,
          style: { width: style.width, minHeight: 32 },
        })}
        <TradesTable data={rowData?.trades || []} />
      </div>
    )
  }
  return defaultTableRowRenderer(props)
}
