/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue } from '@ufx-ui/core'

import { reactVirtualizedCellRenderer } from '../../util/ui'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../constants/precision'

const STYLES = {
  amount: { justifyContent: 'flex-end' },
  price: { justifyContent: 'flex-end' },
}

export default (authToken, cancelOrder, gaCancelOrder, { width }) => [{
  label: '',
  dataKey: '',
  width: 15,
  flexGrow: 0.15,
  cellRenderer: ({ rowData = {} }) => ( // eslint-disable-line
    <div className={`row-marker ${rowData.amount < 0 ? 'red' : 'green'} ${width < 700 ? 'stick' : ''} ${width < 450 ? 'stick2' : ''}`} />
  ),
  disableSort: true,
}, {
  label: 'Pair',
  dataKey: 'symbol',
  width: 135,
  flexGrow: 1.35,
  cellRenderer: ({ rowData = {} }) => reactVirtualizedCellRenderer(rowData.uiID),
}, {
  label: 'Type',
  dataKey: 'type',
  width: 120,
  flexGrow: 1.2,
  cellRenderer: ({ rowData = {} }) => reactVirtualizedCellRenderer(rowData.type),
}, {
  label: 'Created',
  dataKey: 'created',
  width: 145,
  flexGrow: 1.5,
  cellRenderer: ({ rowData = {} }) => reactVirtualizedCellRenderer(new Date(+rowData.created).toLocaleString()),
}, {
  label: 'Amount',
  dataKey: 'amount',
  width: 120,
  flexGrow: 1.2,
  headerStyle: STYLES.amount,
  style: STYLES.amount,
  cellRenderer: ({ rowData = {} }) => (
    <PrettyValue
      value={rowData?.amount}
      decimals={AMOUNT_DECIMALS}
      fadeTrailingZeros
      strike={0}
    />
  ),
}, {
  label: 'Price',
  dataKey: 'price',
  width: 120,
  flexGrow: 1.2,
  headerStyle: STYLES.price,
  style: STYLES.price,
  cellRenderer: ({ rowData = {} }) => (
    <PrettyValue
      value={rowData?.price}
      sigFig={PRICE_SIG_FIGS}
      fadeTrailingZeros
    />
  ),
}, {
  label: 'Status',
  dataKey: 'status',
  width: 100,
  flexGrow: 1,
  cellRenderer: ({ rowData = {} }) => reactVirtualizedCellRenderer(rowData.status),
}, {
  dataKey: 'cid',
  width: 40,
  flexGrow: 0.4,
  cellRenderer: ({ rowData = {} }) => ( // eslint-disable-line
    <div className='icons-cell'>
      <i
        role='button'
        aria-label='Cancel order'
        tabIndex={0}
        className='icon-cancel'
        onClick={() => {
          cancelOrder(authToken, rowData)
          gaCancelOrder()
        }}
      />
    </div>
  ),
  disableSort: true,
}]
