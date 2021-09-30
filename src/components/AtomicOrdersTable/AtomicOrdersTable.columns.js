/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import React from 'react'
import { PrettyValue } from '@ufx-ui/core'

import { defaultCellRenderer } from '../../util/ui'
import { AMOUNT_DECIMALS, PRICE_SIG_FIGS } from '../../constants/precision'

const STYLES = {
  amount: { justifyContent: 'flex-end' },
  price: { justifyContent: 'flex-end' },
}

export default (authToken, cancelOrder, gaCancelOrder, { width }, t, getMarketPair) => [{
  label: '',
  dataKey: '',
  width: 15,
  flexGrow: 0.15,
  cellRenderer: ({ rowData = {} }) => ( // eslint-disable-line
    <div className={`row-marker ${rowData.amount < 0 ? 'red' : 'green'} ${width < 700 ? 'stick' : ''} ${width < 450 ? 'stick2' : ''}`} />
  ),
  disableSort: true,
}, {
  label: t('table.pair'),
  dataKey: 'symbol',
  width: 135,
  flexGrow: 1.35,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.symbol)),
}, {
  label: t('table.type'),
  dataKey: 'type',
  width: 120,
  flexGrow: 1.2,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.type),
}, {
  label: t('table.created'),
  dataKey: 'created',
  width: 145,
  flexGrow: 1.5,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(+rowData.created).toLocaleString()),
}, {
  label: t('table.amount'),
  dataKey: 'amount',
  width: 120,
  flexGrow: 1.2,
  headerStyle: STYLES.amount,
  style: STYLES.amount,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
    <PrettyValue
      value={rowData?.amount}
      decimals={AMOUNT_DECIMALS}
      fadeTrailingZeros
      strike={0}
    />,
  ),
}, {
  label: t('table.price'),
  dataKey: 'price',
  width: 120,
  flexGrow: 1.2,
  headerStyle: STYLES.price,
  style: STYLES.price,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
    <PrettyValue
      value={rowData?.price}
      sigFig={PRICE_SIG_FIGS}
      fadeTrailingZeros
    />,
  ),
}, {
  label: t('table.status'),
  dataKey: 'status',
  width: 100,
  flexGrow: 1,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.status),
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
