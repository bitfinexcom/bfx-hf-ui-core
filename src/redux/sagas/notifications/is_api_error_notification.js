import { put } from 'redux-saga/effects'
import Debug from 'debug'
import _includes from 'lodash/includes'
import WSActions from '../../actions/ws'

const debug = Debug('hfui:rx:s:ntfc')

export default function* isAPIErrorNotification(action = {}) {
  const { payload = {} } = action
  const { notification = {} } = payload
  const { status, text } = notification

  if (status === 'error' && _includes(text, 'auth failed: apikey')) {
    debug('auth failed: wrong API keys')
    yield put(WSActions.authWrongAPIKeys(true))
    yield put(WSActions.authAPIValidating(false))
  }
  if (status === 'error' && _includes(text, 'Authentication failed')) {
    const { href, origin } = window.location
    if (_includes(origin, 'localhost')) {
      // eslint-disable-next-line no-alert
      alert(`
        1. Connect and log in on bitfinex staging
        2. Visit: https://api.staging.bitfinex.com/honey
        3. In the returned URL you will find the authToken query param.
        4. Visit localhost with query param ?authToken={authToken}
      `)
    } else {
      window.location.assign(`${origin}/login?back=${encodeURIComponent(href)}`)
    }
  }
  if (status === 'success' && _includes(text, 'Authenticated with Bitfinex')) {
    yield put(WSActions.authWrongAPIKeys(false))
    yield put(WSActions.authAPIValidating(false))
  }
  if (status === 'success' && _includes(text, 'API credentials saved for')) {
    yield put(WSActions.authWrongAPIKeys(false))
  }
}
