import _get from 'lodash/get'
import _omit from 'lodash/omit'
import { isElectronApp, REDUCER_PATHS } from '../../config'
import WSTypes from '../../constants/ws'

const path = REDUCER_PATHS.WS

const EMPTY_OBJ = {}

export default (state) => {
  const sockets = _get(state, `${path}.socket`, EMPTY_OBJ)

  if (isElectronApp) {
    return sockets
  }

  return _omit(sockets, [WSTypes.ALIAS_DATA_SERVER])
}
