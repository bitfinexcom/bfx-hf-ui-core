import { put } from 'redux-saga/effects'
import Debug from 'debug'
import axios from 'axios'
import zendeskActions from '../../actions/zendesk'

const debug = Debug('hfui:rx:s:zendesk-hfui:getting ccys id')
const URL = `${import.meta.env.VITE_UFX_PUBLIC_API_URL}/v2/conf/pub:map:currency:support:zendesk`

export default function* getCcyIds() {
  try {
    const { data } = yield axios.get(URL)
    yield put(zendeskActions.setCcyIds(data))
  } catch (err) {
    debug('failed to fetch ccys id: %s', err.message)
  }
}
