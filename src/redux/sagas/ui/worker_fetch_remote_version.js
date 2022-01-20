import { put, delay, call } from 'redux-saga/effects'
import _head from 'lodash/head'
import _replace from 'lodash/replace'
import Debug from 'debug'

import UIActions from '../../actions/ui'
import { isElectronApp } from '../../config'

const CHECK_INTERVAL_MS = 60 * 60 * 1000 // 1hr
const REMOTE_MANIFEST_URL = 'https://api.github.com/repos/bitfinexcom/bfx-hf-ui/tags?per_page=1'

const debug = Debug('hfui:rx:s:ws-hfui:worker-fetch-remote-version')

export default function* () {
  while (isElectronApp) {
    let manifest

    try {
      const response = yield call(fetch, REMOTE_MANIFEST_URL)
      manifest = yield response.json()
    } catch (err) {
      debug('failed to fetch remote manifest: %s', err.message)
      return
    }

    let { name } = _head(manifest)
    name = _replace(name, 'v', '')

    yield put(UIActions.saveRemoteVersion(name))
    yield delay(CHECK_INTERVAL_MS)
  }
}
