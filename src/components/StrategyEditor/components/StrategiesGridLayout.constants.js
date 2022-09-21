export const COMPONENTS_KEYS = {
  OPTIONS: '999',
  LIVE_CHART: '1000',
  STRATEGY_PERFOMANCE: '1001',
  STRATEGY_TRADES: '1002',
  IDE: '1003',
  HELP_DOCS: '1004',
}

export const LAYOUT_CONFIG = [
  {
    i: COMPONENTS_KEYS.LIVE_CHART,
    x: 0,
    y: 1,
    w: 75,
    h: 5,
  },
  {
    i: COMPONENTS_KEYS.STRATEGY_PERFOMANCE,
    x: 75,
    y: 1,
    w: 25,
    h: 5,
  },
  // OPTIONS should be after Chart and Perfomance to ensure overlapping dropdowns
  {
    i: COMPONENTS_KEYS.OPTIONS,
    x: 0,
    y: 0,
    w: 100,
    h: 1,
  },
  {
    i: COMPONENTS_KEYS.STRATEGY_TRADES,
    x: 0,
    y: 6,
    w: 100,
    h: 3,
  },
]

export const LAYOUT_CONFIG_WITHOUT_TRADES = [
  {
    i: COMPONENTS_KEYS.LIVE_CHART,
    x: 0,
    y: 1,
    w: 75,
    h: 8,
  },
  {
    i: COMPONENTS_KEYS.STRATEGY_PERFOMANCE,
    x: 75,
    y: 1,
    w: 25,
    h: 8,
  },
  {
    i: COMPONENTS_KEYS.OPTIONS,
    x: 0,
    y: 0,
    w: 100,
    h: 1,
  },
]

export const LAYOUT_CONFIG_NO_DATA = [
  {
    i: COMPONENTS_KEYS.OPTIONS,
    x: 0,
    y: 0,
    w: 100,
    h: 1.25,
  },
]

export const BACKTEST_LAYOUT_CONFIG_NO_DATA = [
  {
    i: COMPONENTS_KEYS.OPTIONS,
    x: 0,
    y: 0,
    w: 20,
    h: 9,
  },
]

export const IDE_LAYOUT_CONFIG = [
  {
    i: COMPONENTS_KEYS.IDE,
    x: 0,
    y: 1,
    w: 60,
    h: 8,
  },
  {
    i: COMPONENTS_KEYS.HELP_DOCS,
    x: 60,
    y: 1,
    w: 40,
    h: 8,
  },
  // OPTIONS should be after Chart and Perfomance to ensure overlapping dropdowns
  {
    i: COMPONENTS_KEYS.OPTIONS,
    x: 0,
    y: 0,
    w: 100,
    h: 1,
  },
]
