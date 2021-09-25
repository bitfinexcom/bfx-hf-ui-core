import _get from 'lodash/get'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.WS

export const getAPIClientState = (state) => _get(state, `${path}.apiClient`, 0)

export const apiClientDisconnected = (state) => getAPIClientState(state) === 0

export const apiClientConnecting = (state) => getAPIClientState(state) === 1

export const apiClientConnected = (state) => getAPIClientState(state) === 2
