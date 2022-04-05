/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue } from '@ufx-ui/core'

import { defaultCellRenderer } from '../../util/ui'
import { PRICE_SIG_FIGS } from '../../constants/precision'
import { resultNumber } from '../Backtester/Results/Results.utils'

const STYLES = {
  flexStart: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
}

export default (t) => [
  {
    label: t('table.id'),
    dataKey: 'order_id',
    width: 150,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(`#${rowData?.order_id}`),
    style: STYLES.center,
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.type'),
    dataKey: 'type',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.flexStart,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.order_js.type),
  },
  {
    label: t('table.signal'),
    dataKey: 'signal',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.center,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer('signal_plug'),
  },
  {
    label: t('table.time'),
    dataKey: 'mts',
    width: 180,
    style: STYLES.center,
    headerStyle: STYLES.flexStart,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.mts).toLocaleString()),
  },
  {
    label: t('table.entryPrice'),
    dataKey: 'entryPrice',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.center,
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
    style: STYLES.center,
    headerStyle: STYLES.center,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.closing_price
      ? (
        <PrettyValue
          value={rowData.price}
          sigFig={PRICE_SIG_FIGS}
          fadeTrailingZeros
        />
      ) : 'open'),
  },
  {
    label: t('table.units'),
    dataKey: 'units',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.center,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
      <PrettyValue
        value={0.0012}
        sigFig={PRICE_SIG_FIGS}
        fadeTrailingZeros
      />,
    ),
  },
  {
    label: t('table.profit'),
    dataKey: 'profit',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.center,
    cellRenderer: ({ rowData = {} }) => resultNumber(rowData.pl),
  },
  {
    label: t('table.position'),
    dataKey: 'profit',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.center,
    cellRenderer: ({ rowData = {} }) => resultNumber(15.565),
  },
  {
    label: t('table.drawdown'),
    dataKey: 'drawdown',
    width: 150,
    style: STYLES.center,
    headerStyle: STYLES.center,
    cellRenderer: ({ rowData = {} }) => resultNumber(15.565),
  },
]
