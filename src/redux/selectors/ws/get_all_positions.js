import _get from 'lodash/get'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getAllPositions = (state) => {
  return _get(state, `${path}.positions`, EMPTY_OBJ)
}

export default getAllPositions
