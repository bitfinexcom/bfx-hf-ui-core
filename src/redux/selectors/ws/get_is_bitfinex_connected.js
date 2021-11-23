import { createSelector } from 'reselect'

import { isElectronApp } from '../../config'
import { apiClientConnected } from './api_client_state'
import getAuthToken from './get_auth_token'

const getIsBitfinexConnected = createSelector(
  getAuthToken,
  apiClientConnected,
  (token, clientConnected) => (isElectronApp ? !!token && clientConnected : !!token),
)

export default getIsBitfinexConnected
