import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getCurrentMode } from './index'

const path = REDUCER_PATHS.UI

const DEFAULT_STATUS = {
  dmsControl: false,
  algoWorker: false,
  bfxClient: false,
  strategyManager: false,
}

const DEFAULT_MODE_SERVICES = {
  main: DEFAULT_STATUS,
  paper: DEFAULT_STATUS,
}

const getServiceStatus = (state) => _get(state, `${path}.serviceStatus`, DEFAULT_MODE_SERVICES)

export default createSelector(
  getCurrentMode,
  getServiceStatus,
  (currentMode, modeServices) => _get(modeServices, currentMode, DEFAULT_STATUS),
)
