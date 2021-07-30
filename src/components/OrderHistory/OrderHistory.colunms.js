import React from 'react'
import _get from 'lodash/get'
import { ORDER_HISTORY_KEYS, PrettyValue, FullDate } from '@ufx-ui/core'
import { getPriceFromStatus, getFormatedStatus } from './OrderHistory.helpers'

const {
  ID,
  PAIR,
  TYPE,
  BASE_CCY,
  AMOUNT,
  PRICE,
  PRICE_AVERAGE,
  PLACED,
  STATUS,
} = ORDER_HISTORY_KEYS

export const ROW_MAPPING = {
  [ID]: {
    index: 0,
  },
  [BASE_CCY]: {
    hidden: true,
  },
  [PAIR]: {
    index: 1,
    format: (value, _, data) => _get(data, 'symbol'),
  },
  [AMOUNT]: {
    index: 2,
    selector: 'originalAmount',
    // eslint-disable-next-line react/prop-types, react/display-name
    renderer: ({ rowData }) => {
      const amount = _get(rowData, 'originalAmount')

      return (amount < 0
        ? <span className='hfui-red'>{amount}</span>
        : <span className='hfui-green'>{amount}</span>
      )
    },
  },
  [PRICE]: {
    index: 3,
  },
  [PRICE_AVERAGE]: {
    index: 4,
    // eslint-disable-next-line react/display-name
    format: (_value, _, data) => {
      const value = getPriceFromStatus(_get(data, 'status'))
      return <PrettyValue value={value} sigFig={5} fadeTrailingZeros />
    },
  },
  [TYPE]: {
    index: 5,
    cellStyle: { width: '20%' },
  },
  [STATUS]: {
    index: 6,
    format: (value, _, data) => {
      return getFormatedStatus(_get(data, 'status'))
    },
  },
  [PLACED]: {
    index: 7,
    selector: 'created',
    // eslint-disable-next-line react/display-name
    format: (value, _, data) => {
      return <FullDate ts={_get(data, 'created')} />
    },
  },
}
