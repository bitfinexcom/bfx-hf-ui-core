import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { THEMES } from '../../redux/selectors/ui'
import { CHART_URL, env } from '../../redux/config'
import './style.css'

const Chart = ({
  market: { wsID, base, quote }, theme,
}) => {
  const queryString = new URLSearchParams({
    wsID,
    base,
    quote,
    env,
    theme: theme === THEMES.DARK ? 'honeyframework-theme:dark-mode' : 'default-theme:light-mode',
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
  theme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
}

Chart.defaultProps = {
  market: {
    base: 'BTC',
    quote: 'USD',
    wsID: 'tBTCUSD',
  },
}

export default memo(Chart)
