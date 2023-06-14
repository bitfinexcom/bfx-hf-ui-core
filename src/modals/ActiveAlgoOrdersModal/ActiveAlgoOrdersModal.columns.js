import React from 'react'
import { Checkbox } from '@ufx-ui/core'

import { getAOContext } from '../../util/order'
import { renderDate } from '../../util/ui'

export default ({
  onOrderSelect, isOrderSelected, t, formatTime,
}) => [
  {
    dataKey: 'algoID',
    width: 30,
    flexGrow: 0.3,
    cellRenderer: (
      { rowData = {} } // eslint-disable-line
    ) => (
      <Checkbox
        className='checkbox'
        checked={isOrderSelected(rowData.gid)}
        onChange={(e) => onOrderSelect(e, rowData.gid, rowData.algoID)}
      />
    ),
    disableSort: true,
  },
  {
    label: t('table.alias'),
    dataKey: 'alias',
    width: 350,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => rowData.alias || rowData.label,
  },
  {
    label: t('table.context'),
    dataKey: 'args._margin',
    width: 90,
    flexGrow: 0.9,
    cellRenderer: ({ rowData = {} }) => getAOContext(rowData),
  },
  {
    label: t('table.created'),
    dataKey: 'createdAt',
    width: 125,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => renderDate(rowData.createdAt || +rowData.gid, formatTime),
  },
  {
    label: t('table.symbol'),
    dataKey: 'args.symbol',
    width: 160,
    flexGrow: 1.6,
    cellRenderer: ({ rowData = {} }) => rowData.args?.symbol,
  },
]
