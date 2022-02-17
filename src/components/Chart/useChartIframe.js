import {
  useState, useEffect, useCallback,
} from 'react'
import _split from 'lodash/split'

import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { CHART_URL } from '../../redux/config'
import { getChartOrdersBySymbol } from '../../redux/selectors/chart'

const EVENT_DATA_SEPARATOR = '?,'
const IFRAME_READY_EVENT = 'chart-iframe-ready'
const CURRENT_MARKET_EVENT = 'current-market'
const OPEN_ORDERS_EVENT = 'open-orders'

const useChartIframe = (iframeID, wsID) => {
  const [isIframeReady, setIsIframeReady] = useState(false)
  const { t } = useTranslation()
  const getChartOrders = useSelector(getChartOrdersBySymbol)
  const orders = getChartOrders(wsID, t)

  useEffect(() => {
    const iframeChart = document.getElementById(iframeID)
    if (isIframeReady) {
      iframeChart.contentWindow.postMessage(`${OPEN_ORDERS_EVENT}${EVENT_DATA_SEPARATOR}${JSON.stringify(orders)}`, CHART_URL)
    }
  }, [orders, iframeID, isIframeReady])

  const sendMarketToChartIframe = useCallback((market) => {
    const iframeChart = document.getElementById(iframeID)
    if (isIframeReady) {
      iframeChart.contentWindow.postMessage(`${CURRENT_MARKET_EVENT}${EVENT_DATA_SEPARATOR}${JSON.stringify(market)}`, CHART_URL)
      iframeChart.contentWindow.postMessage(`${OPEN_ORDERS_EVENT}${EVENT_DATA_SEPARATOR}${JSON.stringify(orders)}`, CHART_URL)
    }
  }, [orders, iframeID, isIframeReady])

  // check if chart-iframe is ready to communicate via `message` events
  const onMessageReceivedFromIframe = useCallback((e) => {
    const data = _split(e.data, EVENT_DATA_SEPARATOR)
    if (e.isTrusted && data?.[0] === IFRAME_READY_EVENT && data?.[1] === iframeID) {
      setIsIframeReady(true)
    }
  }, [iframeID])

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe)
    return () => window.removeEventListener('message', onMessageReceivedFromIframe)
  }, [onMessageReceivedFromIframe])

  return sendMarketToChartIframe
}

export default useChartIframe
