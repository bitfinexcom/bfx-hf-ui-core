import React, { memo } from 'react'
import PropTypes from 'prop-types'

const MetricRow = ({ label, value }) => {
  return (
    <li className='hfui-performance-metrics__item'>
      <p>{label}</p>
      <p>{value}</p>
    </li>
  )
}

MetricRow.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
}

export default memo(MetricRow)
