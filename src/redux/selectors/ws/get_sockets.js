import _get from 'lodash/get'
import _omit from 'lodash/omit'
import { createSelector } from 'reselect'

import { isElectronApp, REDUCER_PATHS } from '../../config'
import WSTypes from '../../constants/ws'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

const getWSState = (state) => _get(state, path, EMPTY_OBJ)

const getSockets = createSelector(
  [
    getWSState,
  ],
  (wsState) => {
    const sockets = _get(wsState, 'socket', EMPTY_OBJ)

    if (isElectronApp) {
      return sockets
    }

    return _omit(sockets, [WSTypes.ALIAS_DATA_SERVER])
  },
)

export default getSockets
