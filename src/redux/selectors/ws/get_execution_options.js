import _get from 'lodash/get'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getExecutionOptions = (state) => {
  return _get(state, `${path}.execution.options`, EMPTY_OBJ)
}

export default getExecutionOptions
