import { put } from 'redux-saga/effects'
import Debug from 'debug'
import axios from 'axios'
import marketActions from '../../actions/market'

const debug = Debug('hfui:rx:s:market-hfui:getting ccys id')
const URL = `${process.env.REACT_APP_UFX_PUBLIC_API_URL}/v2/conf/pub:map:currency:support:zendesk`

export default function* getCcysId() {
  try {
    const { data } = yield axios.get(URL)
    yield put(marketActions.setCcysId(data))
  } catch (err) {
    debug('failed to fetch ccys id: %s', err.message)
  }
}
