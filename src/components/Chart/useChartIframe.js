import {
  useState, useEffect, useCallback,
} from 'react'
import _split from 'lodash/split'

import { useDispatch, useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import UIActions from '../../redux/actions/ui'
import { getChartOrdersBySymbol, getChartPositionBySymbol } from '../../redux/selectors/chart'
import { getAtomicOrders, getAuthToken } from '../../redux/selectors/ws'
import { cancelOrder as cancelOrderFn } from '../AtomicOrdersTable/AtomicOrdersTable.helpers'
import { sendMessageToIframe } from './helpers'

import {
  EVENT_DATA_SEPARATOR,
  IFRAME_READY_EVENT,
  CURRENT_MARKET_EVENT,
  GET_ORDERS_EVENT,
  CANCEL_ORDER_EVENT,
  GET_POSITION_EVENT,
  CLOSE_POSITION_EVENT,
} from './events'

const useChartIframe = (iframeID, wsID) => {
  const [isIframeReady, setIsIframeReady] = useState(false)
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const authToken = useSelector(getAuthToken)
  const allOrders = useSelector(getAtomicOrders)
  const getChartOrders = useSelector(getChartOrdersBySymbol)
  const getChartPosition = useSelector(getChartPositionBySymbol)
  const orders = getChartOrders(wsID, t)
  const position = getChartPosition(wsID, t)?.[0]

  const cancelOrder = useCallback((id) => {
    const symbol = allOrders?.[id]?.symbol
    cancelOrderFn(authToken, { id: Number(id), symbol }, dispatch)
  }, [allOrders, authToken, dispatch])

  const closePosition = useCallback((args) => {
    dispatch(UIActions.changeClosePositionModalState(true, args))
  }, [dispatch])

  useEffect(() => {
    const iframeChart = document.getElementById(iframeID)
    if (isIframeReady) {
      sendMessageToIframe(iframeChart, GET_ORDERS_EVENT, orders)
      sendMessageToIframe(iframeChart, GET_POSITION_EVENT, position || {})
    }
  }, [orders, iframeID, isIframeReady, position])

  const sendMarketToChartIframe = useCallback((market) => {
    const marketOrders = getChartOrders(market?.wsID, t)
    const marketPosition = getChartPosition(market?.wsID, t)?.[0]
    const iframeChart = document.getElementById(iframeID)
    if (isIframeReady) {
      sendMessageToIframe(iframeChart, CURRENT_MARKET_EVENT, market)
      sendMessageToIframe(iframeChart, GET_ORDERS_EVENT, marketOrders)
      sendMessageToIframe(iframeChart, GET_POSITION_EVENT, marketPosition || {})
    }
  }, [getChartOrders, t, getChartPosition, iframeID, isIframeReady])

  // check if chart-iframe is ready to communicate via `message` events
  const onMessageReceivedFromIframe = useCallback((e) => {
    if (!e.isTrusted) {
      return
    }
    const data = _split(e.data, EVENT_DATA_SEPARATOR)
    const eventType = data?.[0]
    const eventIframeID = data?.[1]
    if (eventIframeID !== iframeID) {
      return
    }

    if (eventType === IFRAME_READY_EVENT) {
      setIsIframeReady(true)
    } else if (eventType === CANCEL_ORDER_EVENT) {
      cancelOrder(data?.[2])
    } else if (eventType === CLOSE_POSITION_EVENT) {
      const parsed = JSON.parse(data?.[2])
      closePosition(parsed)
    }
  }, [cancelOrder, closePosition, iframeID])

  useEffect(() => {
    window.addEventListener('message', onMessageReceivedFromIframe)
    return () => window.removeEventListener('message', onMessageReceivedFromIframe)
  }, [onMessageReceivedFromIframe])

  return sendMarketToChartIframe
}

export default useChartIframe
