import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'
import { BACKTEST_TAB_SECTIONS } from '../../reducers/ui'

const path = REDUCER_PATHS.UI

const getBacktestActiveSection = (state) => _get(
  state,
  `${path}.strategyEditor.backtestActiveSection`,
  BACKTEST_TAB_SECTIONS.NEW_BT,
)

export default getBacktestActiveSection
