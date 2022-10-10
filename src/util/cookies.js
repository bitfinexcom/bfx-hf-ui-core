import _get from 'lodash/get'
import _find from 'lodash/find'
import _startsWith from 'lodash/startsWith'
import cookie from 'js-cookie'
import { BFX_TOKEN_COOKIE, BFX_FORCE_LOGIN, BFX_FORCE_LOGIN_MESSAGE } from '../constants/cookies'

const cookieDomain = process.env.REACT_APP_COOKIE_DOMAIN || 'bitfinex.com'
export const defaultCookieOpts = cookieDomain === 'localhost'
  ? {}
  : { secure: true, domain: cookieDomain }

// if later we have pages that don't need authentication
// we can add it here
const noAuthPages = []

export const isNonAuthPage = (path) => _find(noAuthPages, (noAuthPath) => (
  path === noAuthPath || _startsWith(path, noAuthPath)
))

export const getCookieValue = (key) => cookie.get(key)

export const setCookie = (key, value, opts) => {
  cookie.set(key, value, { ...defaultCookieOpts, ...opts })
}

export const removeCookie = (key, opts) => {
  cookie.remove(key, { ...defaultCookieOpts, ...opts })
}

export const authErrorRedirect = (forceRedirect = getCookieValue(BFX_FORCE_LOGIN)) => {
  removeCookie(BFX_TOKEN_COOKIE)
  if (window && forceRedirect) {
    const path = _get(window, 'location.pathname', '')
    if (!isNonAuthPage(path)) {
      setCookie(BFX_FORCE_LOGIN_MESSAGE, true)
      window.location = '/invalid_token'
    }
  }
}
