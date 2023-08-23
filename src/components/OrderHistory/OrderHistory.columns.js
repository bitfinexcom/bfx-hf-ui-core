import React from 'react'
import _get from 'lodash/get'
import _toString from 'lodash/toString'
import { ORDER_HISTORY_KEYS, PrettyValue } from '@ufx-ui/core'

import { getFormatedStatus } from './OrderHistory.helpers'
import { defaultCellRenderer } from '../../util/ui'
import { AMOUNT_DECIMALS } from '../../constants/precision'

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
  UPDATED,
} = ORDER_HISTORY_KEYS

const getRowMapping = (formatTime) => ({
  [ID]: {
    index: 0,
  },
  [BASE_CCY]: {
    hidden: true,
  },
  [PAIR]: {
    index: 1,
  },
  [AMOUNT]: {
    index: 2,
    selector: 'originalAmount',
    renderer: ({ rowData = {} }) => {
      const { originalAmount, amount } = rowData
      const valueProps = {
        decimals: AMOUNT_DECIMALS,
        fadeTrailingZeros: true,
        strike: 0,
      }

      return defaultCellRenderer(
        amount && originalAmount && originalAmount !== amount ? (
          <span>
            <PrettyValue value={amount} {...valueProps} />
            {' '}
            /
            <PrettyValue value={originalAmount} {...valueProps} />
          </span>
        ) : (
          <PrettyValue value={amount || originalAmount} {...valueProps} />
        ),
      )
    },
  },
  [PRICE]: {
    index: 3,
  },
  [PRICE_AVERAGE]: {
    index: 4,
    // eslint-disable-next-line react/display-name
    format: (_value) => {
      const value = _toString(_value)
      return <PrettyValue value={value} sigFig={5} fadeTrailingZeros />
    },
  },
  [TYPE]: {
    index: 5,
    cellStyle: { width: '20%' },
  },
  [STATUS]: {
    index: 6,
    format: (_value, _, data) => {
      let status = _get(data, 'status')
      const orderSubmitError = _get(data, 'orderSubmitError', null)
      if (orderSubmitError) {
        status = `${status}: ${orderSubmitError}`
      }
      return getFormatedStatus(status)
    },
  },
  [UPDATED]: {
    index: 7,
    selector: 'mtsUpdate',
    format: (_value, _, data) => formatTime(_get(data, 'mtsUpdate', null)) || '-',
  },
  [PLACED]: {
    index: 8,
    selector: 'created',
    // eslint-disable-next-line react/display-name
    format: (_value, _, data) => formatTime(_get(data, 'created', null)) || '-',
  },
})

export default getRowMapping
