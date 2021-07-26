import {
  setCookie,
  getCookieValue,
  removeCookie,
} from './cookies'

import { BFX_TOKEN_COOKIE, BFX_TOKEN_COOKIE_TIMESTAMP } from '../constants/cookies'

/**
 * tokenStore
 *
 * Makes auth token accessible outside of redux.
 *
 */

// current authtoken TTL is 10 min, UI marks it at expired at 8 minutes so we can fetch sooner
export const AUTH_TOKEN_TTL = 8 * 60 * 1000 // 8 min

const tokenStore = () => {
  const token = getCookieValue(BFX_TOKEN_COOKIE)
  let tokenTimestamp = Number(getCookieValue(BFX_TOKEN_COOKIE_TIMESTAMP))

  // If token present, but not token timestamp, the token is set from backend
  // We set the timestamp from frontend to avoid time gap between server and client
  if (token && !tokenTimestamp) {
    tokenTimestamp = Date.now()
    setCookie(BFX_TOKEN_COOKIE_TIMESTAMP, tokenTimestamp)
  }

  return {
    token,
    tokenTimestamp,

    reset() {
      const newToken = getCookieValue(BFX_TOKEN_COOKIE)
      const newTokenTimestamp = Number(getCookieValue(BFX_TOKEN_COOKIE_TIMESTAMP))

      this.token = newToken
      this.tokenTimestamp = newTokenTimestamp
    },

    set(newToken) {
      this.token = newToken
      this.tokenTimestamp = Date.now()
      setCookie(BFX_TOKEN_COOKIE, newToken)
      setCookie(BFX_TOKEN_COOKIE_TIMESTAMP, this.tokenTimestamp)
    },

    get(raw = false) {
      return raw
        ? getCookieValue(BFX_TOKEN_COOKIE)
        : this.token
    },

    getTokenTimestamp(raw = false) {
      return raw
        ? Number(getCookieValue(BFX_TOKEN_COOKIE_TIMESTAMP))
        : this.tokenTimestamp
    },

    clear() {
      this.token = null
      this.tokenTimestamp = null
      removeCookie(BFX_TOKEN_COOKIE)
      removeCookie(BFX_TOKEN_COOKIE_TIMESTAMP)
    },
  }
}

const tokenStoreInstance = tokenStore()

export default tokenStoreInstance

export const getAuthToken = (raw = false) => tokenStoreInstance.get(raw)
export const getAuthTokenTimestamp = (raw = false) => tokenStoreInstance.getTokenTimestamp(raw)
export const isAuthTokenExpired = (raw = false) => {
  const timePassed = Date.now() - getAuthTokenTimestamp(raw)
  return timePassed > AUTH_TOKEN_TTL
}
export const getAuthTokenPromise = () => Promise.resolve(tokenStoreInstance.get())
export const clearAuthToken = () => tokenStoreInstance.clear()
