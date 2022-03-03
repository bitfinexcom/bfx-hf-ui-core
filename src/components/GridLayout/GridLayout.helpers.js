import React, { Suspense, lazy } from 'react'
import _assign from 'lodash/assign'
import _map from 'lodash/map'
import _forEach from 'lodash/forEach'
import _find from 'lodash/find'

const OrderForm = lazy(() => import('../OrderForm'))
const OrderBookPanel = lazy(() => import('../OrderBookPanel'))
const ChartPanel = lazy(() => import('../ChartPanel'))
const AtomicOrdersTablePanel = lazy(() => import('../AtomicOrdersTablePanel'))
const AlgoOrdersTablePanel = lazy(() => import('../AlgoOrdersTablePanel'))
const OrderHistory = lazy(() => import('../OrderHistory'))
const TradesTablePanel = lazy(() => import('../TradesTablePanel'))
const PositionsTablePanel = lazy(() => import('../PositionsTablePanel'))
const BalancesTablePanel = lazy(() => import('../BalancesTablePanel'))
const TradingStatePanel = lazy(() => import('../TradingStatePanel'))
const ExchangeInfoBar = lazy(() => import('../ExchangeInfoBar'))

export const COMPONENT_TYPES = {
  CHART: 'CHART',
  ORDER_BOOK: 'ORDER_BOOK',
  ORDER_FORM: 'ORDER_FORM',
  TRADES_TABLE: 'TRADES_TABLE',
  POSITIONS_TABLE: 'POSITIONS_TABLE',
  BALANCES_TABLE: 'BALANCES_TABLE',
  ALGO_ORDERS_TABLE: 'ALGO_ORDERS_TABLE',
  ATOMIC_ORDERS_TABLE: 'ATOMIC_ORDERS_TABLE',
  ORDER_HISTORY_TABLE: 'ORDER_HISTORY_TABLE',
  TRADING_STATE_PANEL: 'TRADING_STATE_PANEL',
  EXCHANGE_INFO_BAR: 'EXCHANGE_INFO_BAR',
}

export const COMPONENT_IDS = {
  MARKET_CHART1: '1563115202169',
  MARKET_CHART2: '1565595676626',
  MARKET_TRADES1: '1563119098026',
  MARKET_TRADES2: '1565595694304',
  MARKET_ORDERBOOK: '1563119067081',
  TRADING_CHART: '1591873294962000',
  TRADING_EXCHANGE_INFO: '1591873294960000',
  TRADING_ORDERBOOK: '1591873324466000',
  TRADING_ORDERFORM: '1591873294961000',
  TRADING_ORDER_HISTORY: '1591961781970000',
  TRADING_TRADES: '1591961760845000',
  TRADING_TRADING_STATE_PANEL: '1591873390469000',
}

export const COMPONENT_TYPES_MARKET_DATA = {
  CHART: 'CHART',
  ORDER_BOOK: 'ORDER_BOOK',
  ORDER_FORM: 'ORDER_FORM',
  TRADES_TABLE: 'TRADES_TABLE',
  POSITIONS_TABLE: 'POSITIONS_TABLE',
  BALANCES_TABLE: 'BALANCES_TABLE',
  ALGO_ORDERS_TABLE: 'ALGO_ORDERS_TABLE',
  ATOMIC_ORDERS_TABLE: 'ATOMIC_ORDERS_TABLE',
  ORDER_HISTORY_TABLE: 'ORDER_HISTORY_TABLE',
  TRADING_STATE_PANEL: 'TRADING_STATE_PANEL',
}

export const COMPONENT_LABELS = {
  [COMPONENT_TYPES.CHART]: 'chartModal.title',
  [COMPONENT_TYPES.ORDER_BOOK]: 'orderBookModal.title',
  [COMPONENT_TYPES.ORDER_FORM]: 'orderForm.title2',
  [COMPONENT_TYPES.TRADES_TABLE]: 'tradesTableModal.title',
  [COMPONENT_TYPES.BALANCES_TABLE]: 'balancesTableModal.title',
  [COMPONENT_TYPES.POSITIONS_TABLE]: 'positionsTableModal.title',
  [COMPONENT_TYPES.ALGO_ORDERS_TABLE]: 'AOTableModal.title',
  [COMPONENT_TYPES.ATOMIC_ORDERS_TABLE]: 'atomicOrdersTableModal.title',
  [COMPONENT_TYPES.ORDER_HISTORY_TABLE]: 'orderHistoryModal.title',
  [COMPONENT_TYPES.TRADING_STATE_PANEL]: 'tradingStatePanel.title',
  [COMPONENT_TYPES.EXCHANGE_INFO_BAR]: 'tickersPanel.title',
}

export const COMPONENT_DIMENSIONS = {
  [COMPONENT_TYPES.CHART]: {
    w: 33, h: 10, minW: 30, minH: 8,
  },
  [COMPONENT_TYPES.ORDER_BOOK]: {
    w: 24, h: 12, minW: 21, minH: 5,
  },
  [COMPONENT_TYPES.ORDER_FORM]: {
    w: 24, h: 12, minW: 16, minH: 6,
  },
  [COMPONENT_TYPES.TRADES_TABLE]: {
    w: 24, h: 10, minW: 18, minH: 4,
  },
  [COMPONENT_TYPES.BALANCES_TABLE]: {
    w: 20, h: 6, minW: 18, minH: 5,
  },
  [COMPONENT_TYPES.POSITIONS_TABLE]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.ALGO_ORDERS_TABLE]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.ATOMIC_ORDERS_TABLE]: {
    w: 40, h: 6, minW: 32, minH: 5,
  },
  [COMPONENT_TYPES.ORDER_HISTORY_TABLE]: {
    w: 40, h: 6, minW: 21, minH: 5,
  },
  [COMPONENT_TYPES.TRADING_STATE_PANEL]: {
    w: 40, h: 6, minW: 40, minH: 5,
  },
  [COMPONENT_TYPES.EXCHANGE_INFO_BAR]: {
    w: 20, h: 8, minW: 20, minH: 4,
  },
}

export const DEFAULT_TRADING_KEY = 'Default Trading Layout'
export const DEFAULT_MARKET_KEY = 'Default Market Data Layout'

const componentForType = (c) => {
  switch (c) {
    case COMPONENT_TYPES.CHART:
      return ChartPanel

    case COMPONENT_TYPES.ORDER_BOOK:
      return OrderBookPanel

    case COMPONENT_TYPES.ORDER_FORM:
      return OrderForm

    case COMPONENT_TYPES.TRADES_TABLE:
      return TradesTablePanel

    case COMPONENT_TYPES.ATOMIC_ORDERS_TABLE:
      return AtomicOrdersTablePanel

    case COMPONENT_TYPES.ALGO_ORDERS_TABLE:
      return AlgoOrdersTablePanel

    case COMPONENT_TYPES.ORDER_HISTORY_TABLE:
      return OrderHistory

    case COMPONENT_TYPES.POSITIONS_TABLE:
      return PositionsTablePanel

    case COMPONENT_TYPES.BALANCES_TABLE:
      return BalancesTablePanel

    case COMPONENT_TYPES.TRADING_STATE_PANEL:
      return TradingStatePanel

    case COMPONENT_TYPES.EXCHANGE_INFO_BAR:
      return ExchangeInfoBar

    default:
      return null
  }
}

export const renderLayoutElement = (layoutID, def = {}, componentProps = {}, onRemoveComponent) => {
  const { i, c, props = {} } = def
  const C = componentForType(c)
  const cProps = {
    ...props,
    ...componentProps.sharedProps,
    layoutID,
    layoutI: i,
    onRemove: () => onRemoveComponent(i),
  }

  if (!C) {
    return (
      <p>
        Unknown component type:
        {c}
      </p>
    )
  }

  if (C === ChartPanel && componentProps.chart) {
    _assign(cProps, componentProps.chart)
  } else if (C === OrderBookPanel && componentProps.book) {
    _assign(cProps, componentProps.book)
  } else if (C === TradesTablePanel && componentProps.trades) {
    _assign(cProps, componentProps.trades)
  } else if (C === OrderForm && componentProps.orderForm) {
    _assign(cProps, componentProps.orderForm)
  } else if (C === AtomicOrdersTablePanel && componentProps.orders) {
    _assign(cProps, componentProps.orders)
  }
  return (
    <Suspense fallback={<></>}>
      <C {...cProps} />
    </Suspense>
  )
}

export const layoutDefToGridLayout = layoutDef => _map(layoutDef.layout, l => ({
  i: l.i,
  x: l.x,
  y: l.y,
  w: l.w,
  h: l.h,
}))

export const gridLayoutToLayoutDef = (layoutDef, parentLayoutDef) => {
  _forEach(parentLayoutDef?.layout, (l) => {
    const elm = _find(layoutDef?.layout, lElm => lElm.i === l?.i)

    if (elm) {
      elm.c = l?.c
    }
  })

  return layoutDef
}
