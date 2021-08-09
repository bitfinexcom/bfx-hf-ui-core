import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS, isElectronApp } from '../../config'
import { getAuthToken as getCookieAuthToken } from '../../../util/token_store'

const path = REDUCER_PATHS.WS

const getElectronAppToken = (state) => _get(state, `${path}.auth.token`, null)

const getAuthToken = createSelector(
  [getElectronAppToken, getCookieAuthToken],
  (electronAppToken, cookieToken) => {
    if (!isElectronApp) {
      console.trace('cookieToken: ', cookieToken)
      return cookieToken
    }

    return electronAppToken
  },
)

export default getAuthToken
