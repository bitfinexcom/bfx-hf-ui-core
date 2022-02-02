import _reduce from 'lodash/reduce'

import {
  GRID_LARGE,
  GRID_MEDIUM,
  GRID_SMALL,
  GRID_XSMALL,
} from '../Grid.constants'
import gridChart from '../items/trading/grid.chart'
import gridExchangeInfoBar from '../items/trading/grid.exchangeinfo'
import gridOrderform from '../items/trading/grid.orderform'
import gridOrderHistory from '../items/trading/grid.orderhistory'
import gridTrades from '../items/trading/grid.trades'
import gridTradingStatePanel from '../items/trading/grid.tradingstate'
import gridOrderBook from '../items/trading/grid.orderbook'

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
  [GRID_LARGE]: [0, 26, 75],
  [GRID_MEDIUM]: [0, 26, 75],
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
  gridComponents: availableMap,
  defaultColumns: columns,
  defaultLayout: {
    [GRID_LARGE]: grid,
    [GRID_MEDIUM]: grid,
    [GRID_SMALL]: mobileGrid,
    [GRID_XSMALL]: mobileGrid,
  },
}
