import {
  setCookie,
  getCookieValue,
  removeCookie,
} from './cookies'

import { BFX_TOKEN_COOKIE } from '../constants/cookies'

/**
 * tokenStore
 *
 * Makes auth token accessible outside of redux.
 *
 */

const tokenStore = () => {
  const token = getCookieValue(BFX_TOKEN_COOKIE)

  return {
    token,

    reset() {
      const newToken = getCookieValue(BFX_TOKEN_COOKIE)
      this.token = newToken
    },

    set(newToken) {
      this.token = newToken
      setCookie(BFX_TOKEN_COOKIE, newToken)
    },

    get(raw = false) {
      return raw
        ? getCookieValue(BFX_TOKEN_COOKIE)
        : this.token
    },

    clear() {
      this.token = null
      removeCookie(BFX_TOKEN_COOKIE)
    },
  }
}

const tokenStoreInstance = tokenStore()

export default tokenStoreInstance

export const getAuthToken = (raw = false) => tokenStoreInstance.get(raw)
export const getAuthTokenPromise = () => Promise.resolve(tokenStoreInstance.get())
export const clearAuthToken = () => tokenStoreInstance.clear()
