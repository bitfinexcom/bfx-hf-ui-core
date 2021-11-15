import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { CHART_URL, env } from '../../redux/config'
import './style.css'

const Chart = ({ market: { wsID, base, quote } }) => {
  const queryString = new URLSearchParams({
    wsID, base, quote, env,
  }).toString()

  return (
    <iframe
      className='hfui-chart-iframe'
      src={`${CHART_URL}/?${queryString}`}
      title='Chart'
    />
  )
}

Chart.propTypes = {
  market: PropTypes.shape({
    wsID: PropTypes.string,
    base: PropTypes.string,
    quote: PropTypes.string,
  }),
}

Chart.defaultProps = {
  market: {
    base: 'BTC',
    quote: 'USD',
    wsID: 'tBTCUSD',
  },
}

export default memo(Chart)
