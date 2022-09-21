import React from 'react'
import { PrettyValue } from '@ufx-ui/core'
import _toString from 'lodash/toString'
import { defaultCellRenderer } from '../../../util/ui'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../../constants/precision'

import {
  getTradeAmount, getTradePriceAvg, getTradesHeaders, getOrderID, getTradeType,
  getTradePrice, getTradeTimestamp, getTradeExecutedAt,
} from './TradesTable.helpers'

const STYLES = {
  RIGHT_ALIGN: { textAlign: 'right' },
}

export default (t) => {
  const {
    id, action, type, timestamp, executedAt, orderPrice, tradePrice, amount,
  } = getTradesHeaders(t)

  return [
    {
      label: id,
      dataKey: 'order_id',
      cellRenderer: ({ rowData }) => defaultCellRenderer(`#${getOrderID(rowData)}`),
    },
    {
      label: action,
      dataKey: 'amount',
      cellRenderer: ({ rowData }) => (getTradeAmount(rowData) < 0 ? 'SELL' : 'BUY'),
    },
    {
      label: type,
      dataKey: 'type',
      cellRenderer: ({ rowData }) => defaultCellRenderer(getTradeType(rowData)),
    },
    {
      label: timestamp,
      dataKey: 'mtsCreate',
      cellRenderer: ({ rowData }) => defaultCellRenderer(getTradeTimestamp(rowData)),
      style: STYLES.RIGHT_ALIGN,
    },
    {
      label: executedAt,
      dataKey: 'mtsUpdate',
      cellRenderer: ({ rowData }) => defaultCellRenderer(getTradeExecutedAt(rowData)),
      style: STYLES.RIGHT_ALIGN,
    },
    {
      label: orderPrice,
      dataKey: 'price',
      cellRenderer: ({ rowData }) => defaultCellRenderer(<PrettyValue value={_toString(getTradePrice(rowData))} sigFig={PRICE_SIG_FIGS} fadeTrailingZeros />),
      style: STYLES.RIGHT_ALIGN,
    },
    {
      label: tradePrice,
      dataKey: 'priceAvg',
      cellRenderer: ({ rowData }) => defaultCellRenderer(
        <PrettyValue value={_toString(getTradePriceAvg(rowData))} sigFig={PRICE_SIG_FIGS} fadeTrailingZeros />,
      ),
      style: STYLES.RIGHT_ALIGN,
    },
    {
      label: amount,
      dataKey: 'units',
      cellRenderer: ({ rowData }) => {
        return defaultCellRenderer(
          <PrettyValue
            value={getTradeAmount(rowData)}
            decimals={AMOUNT_DECIMALS}
            fadeTrailingZeros
          />,
        )
      },
      style: STYLES.RIGHT_ALIGN,
    },
  ]
}
