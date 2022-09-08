import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getIsPaperTrading } from '../ui'

const path = REDUCER_PATHS.WS

const getAPIClientStates = (state) => _get(state, `${path}.apiClient`, {})

export const getAPIClientState = createSelector(
  [getIsPaperTrading, getAPIClientStates],
  (isPaperTrading, APIClientStates) => _get(APIClientStates, isPaperTrading ? 'sandbox' : 'main', 0),
)

export const apiClientDisconnected = (state) => getAPIClientState(state) === 0

export const apiClientConnecting = (state) => getAPIClientState(state) === 1

export const apiClientConnected = (state) => getAPIClientState(state) === 2
