import { useState, useEffect, useCallback } from 'react'
import _split from 'lodash/split'

import { CHART_URL } from '../../redux/config'

const EVENT_DATA_SEPARATOR = '?,'
const IFRAME_READY_EVENT = 'chart-iframe-ready'
const CURRENT_MARKET_EVENT = 'current-market'

const useChartIframe = (iframeID) => {
  const [isIframeReady, setIsIframeReady] = useState(false)

  const sendMarketToChartIframe = useCallback((market) => {
    const iframeChart = document.getElementById(iframeID)
    if (isIframeReady) {
      iframeChart.contentWindow.postMessage(`${CURRENT_MARKET_EVENT}${EVENT_DATA_SEPARATOR}${JSON.stringify(market)}`, CHART_URL)
    }
  }, [iframeID, isIframeReady])

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
