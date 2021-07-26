import { call, put, take, delay, select, takeEvery } from 'redux-saga/effects'
import _get from 'lodash/get'
import _last from 'lodash/last'
import axios from 'axios'

import {
  fetchTokenSuccess,
  fetchTokenFail,
  fetchToken,
  fetchTokenAttempted,
} from '../../actions/authToken.actions'
import tokenStore, { getAuthToken, isAuthTokenExpired } from '../../../util/token_store'
import {
  AUTH_TOKEN_REFRESH_INTERVAL,
  FETCH_AUTH_TOKEN_SUCCESS,
  FETCH_AUTH_TOKEN_ATTEMPTED,
  SET_AUTH_TOKEN_INVALID,
} from '../../constants/authToken.constants'
import { getIsAuthenticated, getTokenAttempted } from '../../selectors/authToken.selectors'
import { authErrorRedirect, getCookieValue } from '../../../util/cookies'
import { BFX_FORCE_LOGIN } from '../../../constants/cookies'
import { recvNotification as notify } from '../../actions/ui'

//
export const DEFAULT_BFX_AUTH_TOKEN_REQ_DATA = {
  scope: 'api',
  writePermission: true,
  caps: ['o', 'f', 's', 'w'],
}

const restAuthTokenRequest = (data = DEFAULT_AUTH_TOKEN_REQ_DATA) => axios({
  method: 'post',
  url: '/v2/auth/w/token',
  headers: {
    Accept: '*/*',
    'Content-Type': 'application/json;charset=UTF-8',
  },
  data,
})

export const exchangeBfxToken = () =>
  restAuthTokenRequest(DEFAULT_BFX_AUTH_TOKEN_REQ_DATA)

const keepAlive = () => axios({
  url: '/api/session/keep-alive',
  withCredentials: true,
})
//


const PING_INTERVAL = 8 * 60 * 1000 // 8 min
let lastPing

let invalidErrors = [] // list of timestamp of the error
const maxError = 3
const minInvalidTime = 2 * 1000 // 2 seconds
const invalidTimeWindow = 20 * 1000 // 20 seconds

function isKeepAliveExpired() {
  if (!lastPing || (Date.now() - lastPing) >= PING_INTERVAL) {
    return true
  }

  return false
}

function* requestToken() {
  if (!tokenStore.get()) {
    if (getCookieValue(BFX_FORCE_LOGIN)) {
      authErrorRedirect()
    }
    return ''
  }

  try {
    const { data = {} } = yield call(exchangeBfxToken)
    const token = _get(data, 0)
    return token
  } catch {
    authErrorRedirect()
    return ''
  }
}

export function* waitUntilAuthenticated() {
  /*
    checks if token is presented in store
    or there was attempt to get token
    and token is not expired
    in this case we don't need to do auth
  */
  function* getWasAuthDone() {
    const wasAuthenticatedOrAttempted = (yield select(getIsAuthenticated))
      || (yield select(getTokenAttempted))

    return wasAuthenticatedOrAttempted && !isAuthTokenExpired()
  }

  if (yield call(getWasAuthDone)) {
    return
  }

  while (true) {
    yield take([FETCH_AUTH_TOKEN_SUCCESS, FETCH_AUTH_TOKEN_ATTEMPTED])
    if (yield call(getWasAuthDone)) {
      return
    }
  }
}

export function* fetchTokenWorker() {
  try {
    const cacheToken = getAuthToken()
    // get latest token from cookie
    const currentToken = getAuthToken(true)
    const isTokenExpired = isAuthTokenExpired(true)

    // call keep alive for the session on main page
    if (isKeepAliveExpired()) {
      lastPing = Date.now()
      keepAlive()
        .catch((err) => {
          console.error(err)
        })
    }

    // user has logged somewhere else
    if (cacheToken && !currentToken) {
      authErrorRedirect(true)
    }

    // get token from cache if not expired
    if (currentToken && !isTokenExpired) {
      tokenStore.reset() // in case the other tab exchange new token
      return yield put(fetchTokenSuccess(currentToken))
    }

    yield put(fetchToken())
    const token = yield call(requestToken)
    tokenStore.set(token)
    if (!token) {
      return yield put(fetchTokenAttempted())
    }
    return yield put(fetchTokenSuccess(token))
  } catch (err) {
    console.error(err)
    tokenStore.clear()
    return yield put(fetchTokenFail(err.message))
  }
}

function* handleInvalidToken() {
  const now = Date.now()
  // consider as an invalid error if total of errors in {invalidTimeWindow} >= {maxError}
  invalidErrors = invalidErrors.filter((time) => now - time <= invalidTimeWindow)

  // only count one per {minInvalidTime}
  const lastError = _last(invalidErrors)
  if (!lastError || now - lastError > minInvalidTime) {
    invalidErrors.push(now)
  }

  if (invalidErrors.length >= maxError) {
    yield put(notify({
      level: 'error',
      message: 'Network error: please reload the page and login to solve it.',
    }))
    invalidErrors = []
  }
}

export default function* authTokenSaga() {
  yield takeEvery(SET_AUTH_TOKEN_INVALID, handleInvalidToken)

  while (true) {
    yield fetchTokenWorker()
    yield delay(AUTH_TOKEN_REFRESH_INTERVAL)
    if (yield select(getTokenAttempted)) {
      // TODO resume polling for token after user logs in - yield take(LOGIN_ACTION)
      return null
    }
  }
}
