import React from 'react'
import { Icon } from 'react-fa'
import _isEmpty from 'lodash/isEmpty'

import { defaultCellRenderer } from '../../util/ui'
import { getAOContext } from '../../util/order'

export default (authToken, cancelOrder, gaCancelOrder, t, getMarketPair, editOrder) => [{
  label: t('table.name'),
  dataKey: 'name',
  width: 90,
  flexGrow: 0.7,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.name),
}, {
  label: t('table.context'),
  dataKey: 'args._margin',
  width: 85,
  flexGrow: 0.85,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getAOContext(rowData)),
}, {
  label: t('table.created'),
  dataKey: 'createdAt',
  width: 175,
  flexGrow: 1.75,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.createdAt || +rowData.gid).toLocaleString()),
}, {
  label: t('table.symbol'),
  dataKey: 'args.symbol',
  width: 150,
  flexGrow: 1.5,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.args?.symbol)),
}, {
  label: t('table.label'),
  dataKey: 'label',
  width: 545,
  flexGrow: 5.4,
  cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.label),
}, {
  dataKey: 'cid',
  width: 50,
  minWidth: 50,
  cellRenderer: ({ rowData = {} }) => ( // eslint-disable-line
    <div className='icons-cell'>
      <Icon
        name='pencil'
        aria-label='Edit order'
        onClick={() => editOrder(rowData)}
      />
      {!_isEmpty(rowData?.id) && (
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
      )}
    </div>
  ),
  disableSort: true,
}]
