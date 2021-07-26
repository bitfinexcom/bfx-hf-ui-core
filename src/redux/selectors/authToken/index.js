import { createSelector } from 'reselect'

export const getToken = (state) => state.authToken || {}
export const getAuthToken = (state) => getToken(state).authToken || ''
export const getIsAuthenticated = (state) => !!getAuthToken(state)
export const getTokenFetching = (state) => getToken(state).fetching
export const getTokenAttempted = (state) => getToken(state).attempted
export const getTokenInited = (state) => getToken(state).inited

// getIsAuthenticated also return false when the token is not inited
// => we need to use this selector to detect that this is unauth session
export const getIsUnauthSession = createSelector(
  [
    getIsAuthenticated,
    getTokenInited,
  ],
  (isAuthenticated, tokenInited) => tokenInited && !isAuthenticated,
)
