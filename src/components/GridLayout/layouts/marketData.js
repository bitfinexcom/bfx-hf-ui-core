import _reduce from 'lodash/reduce'

import {
  GRID_LARGE,
  GRID_MEDIUM,
  GRID_SMALL,
  GRID_XSMALL,
} from '../Grid.constants'
import gridChart1 from '../items/marketData/grid.chart1'
import gridChart2 from '../items/marketData/grid.chart2'
import gridTrades1 from '../items/marketData/grid.trades1'
import gridTrades2 from '../items/marketData/grid.trades2'
import gridOrderBook from '../items/marketData/grid.orderbook'

const available = [
  gridChart1,
  gridChart2,
  gridTrades1,
  gridTrades2,
  gridOrderBook,
]

const availableMap = _reduce(available,
  (acc, cur) => ({
    ...acc,
    [cur.id]: cur,
  }),
  {})

// default number of columns and their x starting point
const columns = {
  [GRID_LARGE]: [0, 53, 76],
  [GRID_MEDIUM]: [0, 53, 76],
  [GRID_SMALL]: [0],
  [GRID_XSMALL]: [0],
}

const grid = [
  [
    gridChart1,
    gridChart2,
  ],
  [
    gridTrades1,
    gridTrades2,
  ],
  [
    gridOrderBook,
  ],
]

const mobileGrid = [
  [
    gridChart1,
    gridChart2,
    gridOrderBook,
    gridTrades1,
    gridTrades2,
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
