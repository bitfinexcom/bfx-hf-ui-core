import React, { memo } from 'react'

const MetricRow = ({ label, value }) => {
  return (
    <li className='hfui-performance-metrics__item'>
      <p>{label}</p>
      <p>{value}</p>
    </li>
  )
}

export default memo(MetricRow)
