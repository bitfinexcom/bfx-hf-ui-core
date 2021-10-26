import React from 'react'
import PropTypes from 'prop-types'
import './style.css'
import { PUB_REST_API_URL, PUB_WSS_API_URL } from '../../redux/config'

const CHART_URL = 'http://localhost:3001/bfx-hf-tradingview'

const Chart = ({ market: { wsID, base, quote } }) => {
  const queryString = new URLSearchParams({
    wsID,
    base,
    quote,
    apiBaseUrl: PUB_REST_API_URL,
    wsBaseURL: PUB_WSS_API_URL,
  }).toString()

  return (
    <iframe
      className='hfui-chart-iframe'
      src={`${CHART_URL}/?${queryString}`}
      title='thumbnails'
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

export default React.memo(Chart)
