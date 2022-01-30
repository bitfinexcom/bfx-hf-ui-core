import _reduce from 'lodash/reduce'

import {
  GRID_LARGE,
  GRID_MEDIUM,
  GRID_SMALL,
  GRID_XSMALL,
  STORED_LAYOUT_TRADING_KEY,
} from '../Grid.constants'
import gridChart from '../items/grid.chart'
import gridExchangeInfoBar from '../items/grid.exchangeinfo'
import gridOrderform from '../items/grid.orderform'
import gridOrderHistory from '../items/grid.orderhistory'
import gridTrades from '../items/grid.trades'
import gridTradingStatePanel from '../items/grid.tradingstate'
import gridOrderBook from '../items/grid.orderbook'

const available = [
  gridExchangeInfoBar,
  gridOrderform,
  gridChart,
  gridOrderBook,
  gridTrades,
  gridTradingStatePanel,
  gridOrderHistory,
]

const availableMap = _reduce(available,
  (acc, cur) => ({
    ...acc,
    [cur.id]: cur,
  }),
  {})

// default number of columns and their x starting point
const columns = {
  [GRID_LARGE]: [0, 4, 12],
  [GRID_MEDIUM]: [0, 3],
  [GRID_SMALL]: [0],
  [GRID_XSMALL]: [0],
}

const grid = [
  [
    gridExchangeInfoBar,
    gridOrderform,
  ],
  [
    gridChart,
    gridTradingStatePanel,
  ],
  [
    gridOrderBook,
    gridTrades,
    gridOrderHistory,
  ],
]

const mobileGrid = [
  [
    gridExchangeInfoBar,
    gridChart,
    gridOrderform,
    gridOrderBook,
    gridTrades,
    gridTradingStatePanel,
    gridOrderHistory,
  ],
]

export default {
  gridId: STORED_LAYOUT_TRADING_KEY, // for save/load
  gridComponents: availableMap,
  defaultColumns: columns,
  defaultLayout: {
    [GRID_LARGE]: grid,
    [GRID_MEDIUM]: grid,
    [GRID_SMALL]: mobileGrid,
    [GRID_XSMALL]: mobileGrid,
  },
}
