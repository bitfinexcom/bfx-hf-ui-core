import { put, delay, call } from 'redux-saga/effects'
import _replace from 'lodash/replace'
import _find from 'lodash/find'
import semver from 'semver'
import Debug from 'debug'

import UIActions from '../../actions/ui'
import { isElectronApp, appVersion } from '../../config'

const CHECK_INTERVAL_MS = 60 * 60 * 1000 // 1hr
const REMOTE_MANIFEST_URL = 'https://api.github.com/repos/bitfinexcom/bfx-hf-ui/releases'

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

    // skip draft and pre-release
    const latest = _find(manifest, ({ prerelease, draft }) => !prerelease && !draft)

    let { name } = latest
    name = _replace(name, 'v', '')

    // check if greater than current app version
    const hasNewRelease = semver.gt(name, appVersion)
    if (!hasNewRelease) {
      return
    }

    yield put(UIActions.saveRemoteVersion(name))
    yield delay(CHECK_INTERVAL_MS)
  }
}
