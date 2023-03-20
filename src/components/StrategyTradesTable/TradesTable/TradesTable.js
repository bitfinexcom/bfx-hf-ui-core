import React, { forwardRef, useMemo } from 'react'
import { Table } from '@ufx-ui/core'
import _map from 'lodash/map'
import { useTranslation } from 'react-i18next'

import { useSelector } from 'react-redux'
import getColumns from './TradesTable.columns'
import { getFormatTimeFn } from '../../../redux/selectors/ui'

// eslint-disable-next-line prefer-arrow-callback
const TradesTable = forwardRef(function TradesTable({ data }, ref) {
  // eslint-disable-line react/prop-types
  const { t } = useTranslation()
  const formatTime = useSelector(getFormatTimeFn)

  const columns = useMemo(() => getColumns(t, formatTime), [formatTime, t])

  return (
    <div className='hfui-trades-sub-table'>
      <Table condensed ref={ref}>
        <thead>
          <tr>
            {_map(columns, (col) => (
              <th style={col?.style} key={col.dataKey || col.label}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {_map(data, (rowData) => (
            <tr key={rowData?.order_id}>
              {_map(columns, ({
                cellRenderer, style, dataKey, label,
              }) => (
                <td style={style} key={dataKey || label}>
                  {cellRenderer({ rowData })}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
})

TradesTable.propTypes = {}

export default TradesTable
