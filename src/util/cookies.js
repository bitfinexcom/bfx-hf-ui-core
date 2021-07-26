import * as cookie from 'js-cookie'

export const getCookieValue = (key) => cookie.get(key)

export const setCookie = (key, value, opts) => {
  cookie.set(key, value, { ...defaultCookieOpts, ...opts })
}

export const removeCookie = (key, opts) => {
  cookie.remove(key, { ...defaultCookieOpts, ...opts })
}

export const authErrorRedirect = (forceRedirect = getCookieValue(COOKIES.FORCE_LOGIN)) => {
  removeCookie(BFX_TOKEN_COOKIE)
  if (window && forceRedirect) {
    const path = _get(window, 'location.pathname', '')
    if (isAuthPage(path)) {
      setCookie(COOKIES.FORCE_LOGIN_MESSAGE, true)
      window.location = `${rootUrl}/invalid_token`
    }
  }
}