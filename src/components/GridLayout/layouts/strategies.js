import _reduce from 'lodash/reduce'

import {
  GRID_LARGE,
  GRID_MEDIUM,
  GRID_SMALL,
  GRID_XSMALL,
} from '../Grid.constants'
import strategiesListTable from '../items/strategies/strategies.listTable'
import strategiesLiveChart from '../items/strategies/strategies.liveChart'
import strategiesPerformanceMetrics from '../items/strategies/strategies.performanceMetrics'
import strategiesSidebar from '../items/strategies/strategies.sidebar'
import strategiesTradesTable from '../items/strategies/strategies.tradesTable'

const available = [
  strategiesListTable,
  strategiesSidebar,
  strategiesLiveChart,
  strategiesPerformanceMetrics,
  strategiesTradesTable,
]

const availableMap = _reduce(available,
  (acc, cur) => ({
    ...acc,
    [cur.id]: cur,
  }),
  {})

// default number of columns and their x starting point
const columns = {
  [GRID_LARGE]: [0, 10, 50, 80],
  [GRID_MEDIUM]: [0, 5],
}

const grid = [
  [strategiesSidebar, strategiesTradesTable, strategiesListTable],
  [strategiesLiveChart],
  [strategiesPerformanceMetrics],
]

export default {
  gridComponents: availableMap,
  defaultColumns: columns,
  defaultLayout: {
    [GRID_LARGE]: grid,
    [GRID_MEDIUM]: grid,
  },
}
