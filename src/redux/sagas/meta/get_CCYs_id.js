import { put } from 'redux-saga/effects'
import Debug from 'debug'
import axios from 'axios'
import marketActions from '../../actions/market'

const debug = Debug('hfui:rx:s:market-hfui:getting CCYs id')
const URL = 'http://localhost:45001/v2/conf/pub:map:currency:support:zendesk'

export default function* getCCYsId() {
  try {
    const { data } = yield axios.get(URL)
    yield put(marketActions.setCCYsId(data))
  } catch (err) {
    debug('failed to fetch CCYs id: %s', err.message)
  }
}
