import _get from 'lodash/get'
import _includes from 'lodash/includes'
import { RC_KEYWORD, REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

export default (state) => {
  const version = _get(state, `${path}.remoteVersion`, null)
  return _includes(version, RC_KEYWORD) ? '' : version
}
