import { put, select } from 'redux-saga/effects'
import { v4 as uuidv4 } from 'uuid'
import Debug from 'debug'

import UIActions from '../../actions/ui'
import { getOptinVendorPendo } from '../../selectors/ui'
import { LOCAL_STORAGE_UID } from '../../../constants/variables'
import { LOCAL_STORAGE_I18N_KEY } from '../../../locales/i18n'

const getPendoVisitorId = () => {
  const visitorId = localStorage.getItem(LOCAL_STORAGE_UID)

  if (visitorId) {
    return visitorId
  }

  const newVisitorId = uuidv4()
  localStorage.setItem(LOCAL_STORAGE_UID, newVisitorId)

  return newVisitorId
}

const PENDO_API_KEY = process.env.REACT_APP_PENDO_API_KEY
const PENDO_VISITOR_ID = getPendoVisitorId()

const debug = Debug('hfui:pendo')

export default function* ({ payload = {} }) {
  const { auid, mode } = payload
  const language = localStorage.getItem(LOCAL_STORAGE_I18N_KEY) || 'en-US'

  const { pendo } = window

  if (!PENDO_API_KEY) {
    debug('pendo api key is absent')
    return
  }

  if (!pendo || !auid) {
    debug('pendo is empty')
    return
  }

  const optinVendorPendo = yield select(getOptinVendorPendo)

  if (!optinVendorPendo) {
    debug('Pendo tracking is disabled (optinVendorPendo flag is false)')
    return
  }

  try {
    const isPendoInitialized = pendo.isReady()

    if (isPendoInitialized) {
      pendo.identify({
        visitor: {
          id: PENDO_VISITOR_ID,
          language,
        },
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
      apiKey: PENDO_API_KEY,
      visitor: {
        id: PENDO_VISITOR_ID,
        language,
      },
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
