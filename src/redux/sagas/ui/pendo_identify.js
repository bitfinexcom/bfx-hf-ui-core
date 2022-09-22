import { put } from 'redux-saga/effects'
import Debug from 'debug'
import UIActions from '../../actions/ui'

const debug = Debug('hfui:pendo')

export default function* ({ payload = {} }) {
  const { auid, mode } = payload

  const { pendo } = window
  if (!pendo || !auid) {
    debug('pendo is empty')
    return
  }

  const isPendoInitialized = pendo.isReady()
  if (isPendoInitialized) {
    pendo.identify({
      account: {
        id: auid,
        mode,
      },
    })
    debug('pendo identified', auid)
    yield put(UIActions.setPendoState(true, auid))
    return
  }
  pendo.initialize({
    account: {
      id: auid, // Required if using Pendo Feedback
      mode,
    },
  })
  debug('pendo initialized', auid)
  yield put(UIActions.setPendoState(true, auid))
}
