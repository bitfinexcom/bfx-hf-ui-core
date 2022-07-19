import React, { memo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { reduxSelectors } from '@ufx-ui/bfx-containers'
import PropTypes from 'prop-types'
import _isUndefined from 'lodash/isUndefined'

import { useTranslation } from 'react-i18next'
import { LANGUAGES_CHART_TABLE } from '../../locales/i18n'
import { THEMES } from '../../redux/selectors/ui'
import { CHART_URL, env } from '../../redux/config'
import useChartIframe from './useChartIframe'
import { getPairFromMarket } from '../../util/market'
import { INDICATORS_ARRAY_SHAPE, MARKET_SHAPE, TRADE_SHAPE } from '../../constants/prop-types-shapes'

import './style.css'

const { getCurrencySymbolMemo } = reduxSelectors

const Chart = ({
  market,
  theme,
  layoutI,
  indicators,
  trades,
  interval,
  hideResolutions,
  chartRange,
}) => {
  const isSetInterval = !_isUndefined(interval)
  const {
    wsID, base, quote, isPerp, uiID: _uiID,
  } = market
  const getCurrencySymbol = useSelector(getCurrencySymbolMemo)
  const { i18n } = useTranslation()

  const i18nMappedKey = i18n.getMappedLanguageKey()

  const uiID = isPerp ? _uiID : getPairFromMarket(market, getCurrencySymbol)
  const iframeID = `hfui-chart-${layoutI}`
  const sendMarketToChartIframe = useChartIframe(iframeID, wsID, indicators, trades, interval, isSetInterval, chartRange)

  const queryString = new URLSearchParams({
    env,
    theme: theme === THEMES.DARK ? 'honeyframework-theme:dark-mode' : 'default-theme:light-mode',
    locale: LANGUAGES_CHART_TABLE[i18nMappedKey] || LANGUAGES_CHART_TABLE.en,
    iframeID,
    hideResolutions,
  }).toString()

  useEffect(() => {
    const marketProps = {
      wsID, uiID, base, quote,
    }
    sendMarketToChartIframe(marketProps)
  }, [base, quote, uiID, wsID, sendMarketToChartIframe])

  return (
    <iframe
      className='hfui-chart-iframe'
      src={`${CHART_URL}?${queryString}`}
      title='Chart'
      id={iframeID}
    />
  )
}

Chart.propTypes = {
  market: PropTypes.shape(MARKET_SHAPE),
  theme: PropTypes.oneOf([THEMES.LIGHT, THEMES.DARK]).isRequired,
  layoutI: PropTypes.string.isRequired,
  indicators: INDICATORS_ARRAY_SHAPE,
  trades: PropTypes.arrayOf(PropTypes.shape(TRADE_SHAPE)),
  interval: PropTypes.string,
  hideResolutions: PropTypes.bool,
  chartRange: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

Chart.defaultProps = {
  market: {
    base: 'BTC',
    quote: 'USD',
    wsID: 'tBTCUSD',
    uiID: 'BTC/USD',
  },
  indicators: [],
  trades: [],
  interval: undefined,
  hideResolutions: false,
  chartRange: null,
}

export default memo(Chart)
