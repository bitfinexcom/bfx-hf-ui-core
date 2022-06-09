import React from 'react'
import { Table } from '@ufx-ui/core'
import _map from 'lodash/map'
import { useTranslation } from 'react-i18next'

import getColumns from './TradesTable.columns'

// eslint-disable-next-line react/prop-types
function TradesTable({ data }) {
  const { t } = useTranslation()
  const columns = getColumns(t)

  return (
    <div className='hfui-trades-sub-table'>
      <Table condensed>
        <thead>
          {_map(columns, col => (
            <th style={col?.style}>
              {col.label}
            </th>
          ))}
        </thead>
        <tbody>
          {_map(data, (rowData) => (
            <tr>
              {_map(columns, ({ cellRenderer, style }) => (
                <td style={style}>
                  {cellRenderer({ rowData })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

TradesTable.propTypes = {}

export default TradesTable
