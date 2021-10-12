import React from 'react'

import { defaultCellRenderer } from '../../util/ui'

export default (authToken, cancelOrder, gaCancelOrder, t, getMarketPair) => [{
  label: t('table.name'),
  dataKey: 'name',
  width: 90,
  flexGrow: 0.7,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.name),
}, {
  label: t('table.context'),
  dataKey: 'args._margin',
  width: 65,
  flexGrow: 0.65,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.args?._margin ? 'Margin' : 'Exchange'),
}, {
  label: t('table.created'),
  dataKey: 'createdAt',
  width: 155,
  flexGrow: 1.55,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.createdAt).toLocaleString()),
}, {
  label: t('table.symbol'),
  dataKey: 'args.symbol',
  width: 140,
  flexGrow: 1.4,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.args?.symbol)),
}, {
  label: t('table.label'),
  dataKey: 'label',
  width: 545,
  flexGrow: 5.4,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.label),
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
