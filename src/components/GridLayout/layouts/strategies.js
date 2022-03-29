import _reduce from 'lodash/reduce'

import {
  GRID_LARGE,
  GRID_MEDIUM,
  GRID_SMALL,
  GRID_XSMALL,
} from '../Grid.constants'
import strategiesListTable from '../items/strategies/strategies.listTable'
import strategiesLiveChart from '../items/strategies/strategies.liveChart'

const available = [
  strategiesListTable,
  // strategiesLiveChart,
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
}

const grid = [
  // [strategiesLiveChart],
  [strategiesListTable],
]

export default {
  gridComponents: availableMap,
  defaultColumns: columns,
  defaultLayout: {
    [GRID_LARGE]: grid,
    [GRID_MEDIUM]: grid,
  },
}
