import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'
import { UI_KEYS } from '../../constants/ui_keys'

const path = REDUCER_PATHS.UI

export default (state) => _get(
  state,
  `${path}.${UI_KEYS.strategyEditor}.strategyMainMode.executionId`,
  null,
)
