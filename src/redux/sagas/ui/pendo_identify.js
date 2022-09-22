import { put } from 'redux-saga/effects'
import Debug from 'debug'
import UIActions from '../../actions/ui'

const PENDO_API_KEY = process.env.REACT_APP_PENDO_API_KEY

const debug = Debug('hfui:pendo')

export default function* ({ payload = {} }) {
  const { auid, mode } = payload

  const { pendo } = window

  if (!PENDO_API_KEY) {
    debug('pendo  api key is absent')
    return
  }

  if (!pendo || !auid) {
    debug('pendo is empty')
    return
  }

  try {
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
        id: auid,
        mode,
      },
    })
    debug('pendo initialized', auid)
    yield put(UIActions.setPendoState(true, auid))
  } catch (e) {
    debug('caught an error', e)
    yield put(UIActions.setPendoState(false))
  }
}
