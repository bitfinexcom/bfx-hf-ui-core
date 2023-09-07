import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

export default (state) => _get(state, `${path}.backtest.results`, EMPTY_OBJ)
