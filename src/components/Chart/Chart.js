import React from 'react'
import PropTypes from 'prop-types'

import { THEMES } from '../../redux/selectors/ui'
import { PUB_REST_API_URL, PUB_WSS_API_URL } from '../../redux/config'
import './style.css'

const CHART_URL = 'https://bitfinexcom.github.io/bfx-hf-tradingview'

const Chart = ({
  market: { wsID, base, quote }, theme,
}) => {
  const queryString = new URLSearchParams({
    wsID,
    base,
    quote,
    apiBaseUrl: PUB_REST_API_URL,
    wsBaseURL: PUB_WSS_API_URL,
    theme: theme === THEMES.DARK ? 'honeyframework-theme:dark-mode' : 'default-theme:light-mode',
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
  theme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

Chart.defaultProps = {
  market: {
    base: 'BTC',
    quote: 'USD',
    wsID: 'tBTCUSD',
  },
}

export default React.memo(Chart)
