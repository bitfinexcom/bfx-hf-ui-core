import React, { memo } from 'react'
import { useSelector } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import PropTypes from 'prop-types'

import { LANGUAGES_CHART_TABLE } from '../../locales/i18n'
import { getCurrentLanguage, THEMES } from '../../redux/selectors/ui'
import { CHART_URL, env } from '../../redux/config'
import { getPairFromMarket } from '../../util/market'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const Chart = ({ market, theme }) => {
  const {
    wsID, base, quote, isPerp, uiID: _uiID,
  } = market
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const language = useSelector(getCurrentLanguage)

  const uiID = isPerp ? _uiID : getPairFromMarket(market, getCurrencySymbol)

  const queryString = new URLSearchParams({
    wsID,
    uiID,
    base,
    quote,
    env,
    theme: theme === THEMES.DARK ? 'honeyframework-theme:dark-mode' : 'default-theme:light-mode',
    locale: LANGUAGES_CHART_TABLE[language],
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
  theme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
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
