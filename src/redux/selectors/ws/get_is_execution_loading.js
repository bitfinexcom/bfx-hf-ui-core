import _get from 'lodash/get'

import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

const getIsExecutionLoading = (state) => {
  const loading = _get(state, `${path}.execution.loading`, false)
  const loadingGid = _get(state, `${path}.execution.loadingGid`, null)

  const loadingState = { loading }

  // We do not need loadingGid if loading is false
  if (loading && loadingGid) {
    loadingState.loadingGid = loadingGid
  }

  return loadingState
}

export default getIsExecutionLoading
