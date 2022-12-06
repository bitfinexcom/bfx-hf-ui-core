import React from 'react'
import { Icon } from 'react-fa'
import _isEmpty from 'lodash/isEmpty'

import { defaultCellRenderer } from '../../util/ui'
import { getAOContext } from '../../util/order'

export default ({
  authToken,
  cancelOrder,
  gaCancelOrder,
  t,
  getMarketPair,
  editOrder,
  showActions,
}) => {
  const columns = [
    {
      label: t('table.alias'),
      dataKey: 'name',
      width: 90,
      flexGrow: 0.7,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.name),
    },
    {
      label: t('table.created'),
      dataKey: 'createdAt',
      width: 175,
      flexGrow: 1.75,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
        new Date(rowData.createdAt || +rowData.gid).toLocaleString(),
      ),
    },
    {
      label: t('table.lastActive'),
      dataKey: 'createdAt',
      width: 175,
      flexGrow: 1.75,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(
        'N/A',
        // new Date(rowData.createdAt || +rowData.gid).toLocaleString(),
      ),
    },
    {
      label: t('table.symbol'),
      dataKey: 'args.symbol',
      width: 150,
      flexGrow: 1.5,
      cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.args?.symbol)),
    },
    {
      label: '',
      dataKey: '',
      width: 300,
      flexGrow: 3.0,
      cellRenderer: () => (
        <div className='hfui-aolist__wrapper_more_info'>
          <Icon
            name='info-circle'
            aria-label='More info'
            onClick={() => {}}
          />
          <span className='more_info_action'>
            {t('table.moreInfo')}
          </span>
        </div>
      ),
    },
  ]

  if (showActions) {
    columns.push({
      dataKey: 'cid',
      width: 50,
      minWidth: 50,
      cellRenderer: (
        { rowData = {} } // eslint-disable-line
      ) => (
        <div className='icons-cell'>
          <Icon
            name='pencil'
            aria-label='Edit order'
            onClick={() => editOrder(rowData)}
          />
          {!_isEmpty(rowData?.gid) && (
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
    })
  }

  return columns
}
