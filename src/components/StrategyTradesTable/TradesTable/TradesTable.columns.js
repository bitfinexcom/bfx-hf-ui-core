import React from 'react'
import { PrettyValue } from '@ufx-ui/core'
import _toString from 'lodash/toString'
import { defaultCellRenderer } from '../../../util/ui'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../../constants/precision'

const STYLES = {
  RIGHT_ALIGN: { textAlign: 'right' },
}

export default (t) => ([
  {
    label: t('table.id'),
    dataKey: 'order_id',
    cellRenderer: ({ rowData }) => defaultCellRenderer(`#${rowData?.order_id}`),
  },
  {
    label: t('table.action'),
    dataKey: 'amount',
    cellRenderer: ({ rowData }) => (rowData?.amount < 0 ? 'SELL' : 'BUY'),
  },
  {
    label: t('table.type'),
    dataKey: 'type',
    cellRenderer: ({ rowData }) => defaultCellRenderer(rowData?.order_js?.type),
  },
  {
    label: t('table.timestamp'),
    dataKey: 'mtsCreate',
    cellRenderer: ({ rowData }) => defaultCellRenderer(new Date(rowData?.order_js?.mtsCreate).toLocaleString()),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.executedAt'),
    dataKey: 'mtsUpdate',
    cellRenderer: ({ rowData }) => defaultCellRenderer(new Date(rowData?.order_js?.mtsUpdate).toLocaleString()),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.orderPrice'),
    dataKey: 'price',
    cellRenderer: ({ rowData }) => defaultCellRenderer(<PrettyValue value={_toString(rowData?.order_js?.price)} sigFig={PRICE_SIG_FIGS} fadeTrailingZeros />),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.tradePrice'),
    dataKey: 'priceAvg',
    cellRenderer: ({ rowData }) => defaultCellRenderer(
      <PrettyValue value={_toString(rowData?.order_js?.priceAvg)} sigFig={PRICE_SIG_FIGS} fadeTrailingZeros />,
    ),
    style: STYLES.RIGHT_ALIGN,
  },
  {
    label: t('table.units'),
    dataKey: 'units',
    cellRenderer: ({ rowData }) => defaultCellRenderer(
      <PrettyValue
        value={rowData?.amount}
        decimals={AMOUNT_DECIMALS}
        fadeTrailingZeros
      />,
    ),
    style: STYLES.RIGHT_ALIGN,
  },
])
