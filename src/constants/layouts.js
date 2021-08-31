import { tradingTerminal, marketData } from './routes'

export const DEFAULT_TRADING_KEY = 'Default Trading Layout'
export const DEFAULT_MARKET_KEY = 'Default Market Data Layout'

export const LOADING_LAYOUT = {
  layout: [
    {
      w: 26,
      h: 8,
      minW: 20,
      minH: 4,
      x: 0,
      y: 0,
      i: '1591873294960000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    }, {
      w: 26,
      h: 13,
      minW: 16,
      minH: 6,
      x: 0,
      y: 8,
      i: '1591873294961000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    }, {
      w: 49,
      h: 11,
      minW: 30,
      minH: 8,
      x: 26,
      y: 0,
      i: '1591873294962000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    }, {
      w: 25,
      h: 7,
      minW: 21,
      minH: 5,
      x: 75,
      y: 0,
      i: '1591873324466000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    }, {
      w: 49,
      h: 10,
      minW: 32,
      minH: 5,
      x: 26,
      y: 11,
      i: '1591873390469000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    }, {
      w: 25,
      h: 7,
      minW: 18,
      minH: 4,
      x: 75,
      y: 6,
      i: '1591961760845000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    }, {
      w: 25,
      h: 7,
      minW: 21,
      minH: 5,
      x: 75,
      y: 12,
      i: '1591961781970000',
      moved: false,
      static: false,
      c: 'LOADING_PANEL',
    },
  ],
}

export const DEFAULT_TRADING_LAYOUT = {
  id: `${tradingTerminal.path}:${DEFAULT_TRADING_KEY}`,
  routePath: tradingTerminal.path,
  name: DEFAULT_TRADING_KEY,
  canDelete: false,
  isDefault: true,
  savedAt: 0,
  layout: [
    {
      w: 26,
      h: 8,
      minW: 20,
      minH: 4,
      x: 0,
      y: 0,
      i: '1591873294960000',
      moved: false,
      static: false,
      c: 'EXCHANGE_INFO_BAR',
    }, {
      w: 26,
      h: 13,
      minW: 16,
      minH: 6,
      x: 0,
      y: 8,
      i: '1591873294961000',
      moved: false,
      static: false,
      c: 'ORDER_FORM',
    }, {
      w: 49,
      h: 11,
      minW: 30,
      minH: 8,
      x: 26,
      y: 0,
      i: '1591873294962000',
      moved: false,
      static: false,
      c: 'CHART',
    }, {
      w: 25,
      h: 7,
      minW: 21,
      minH: 5,
      x: 75,
      y: 0,
      i: '1591873324466000',
      moved: false,
      static: false,
      c: 'ORDER_BOOK',
    }, {
      w: 49,
      h: 10,
      minW: 32,
      minH: 5,
      x: 26,
      y: 11,
      i: '1591873390469000',
      moved: false,
      static: false,
      c: 'TRADING_STATE_PANEL',
    }, {
      w: 25,
      h: 7,
      minW: 18,
      minH: 4,
      x: 75,
      y: 6,
      i: '1591961760845000',
      moved: false,
      static: false,
      c: 'TRADES_TABLE',
    }, {
      w: 25,
      h: 7,
      minW: 21,
      minH: 5,
      x: 75,
      y: 12,
      i: '1591961781970000',
      moved: false,
      static: false,
      c: 'ORDER_HISTORY_TABLE',
    },
  ],
}

export const DEFAULT_MARKET_DATA_LAYOUT = {
  id: `${marketData.path}:${DEFAULT_MARKET_KEY}`,
  routePath: marketData.path,
  name: DEFAULT_MARKET_KEY,
  canDelete: false,
  isDefault: true,
  savedAt: 0,
  layout: [{
    w: 53, h: 10, minW: 30, minH: 8, x: 0, y: 0, i: '1563115202169', moved: false, static: false, c: 'CHART',
  }, {
    w: 24, h: 20, minW: 21, minH: 5, x: 76, y: 0, i: '1563119067081', moved: false, static: false, c: 'ORDER_BOOK',
  }, {
    w: 23, h: 10, minW: 18, minH: 4, x: 53, y: 0, i: '1563119098026', moved: false, static: false, c: 'TRADES_TABLE',
  }, {
    w: 53, h: 10, minW: 30, minH: 8, x: 0, y: 10, i: '1565595676626', moved: false, static: false, c: 'CHART',
  }, {
    w: 23, h: 10, minW: 18, minH: 4, x: 53, y: 10, i: '1565595694304', moved: false, static: false, c: 'TRADES_TABLE',
  }],
}
