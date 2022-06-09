import _get from 'lodash/get'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getIsExecutionLoading = (state) => {
  return _get(state, `${path}.execution.loading`, false)
}

export default getIsExecutionLoading
