import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import PropTypes from 'prop-types'

import { CHART_URL, env } from '../../redux/config'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const Chart = ({
  market: {
    wsID, base, quote, isPerp, uiID: _uiID,
  },
}) => {
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)

  const uiID = isPerp ? _uiID : `${getCurrencySymbol(base)}/${getCurrencySymbol(quote)}`

  const queryString = new URLSearchParams({
    wsID,
    uiID,
    base,
    quote,
    env,
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
    uiID: PropTypes.string,
    isPerp: PropTypes.bool.isRequired,
  }),
}

Chart.defaultProps = {
  market: {
    base: 'BTC',
    quote: 'USD',
    wsID: 'tBTCUSD',
    uiID: 'BTC/USD',
  },
}

export default memo(Chart)
