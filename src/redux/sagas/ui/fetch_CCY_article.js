import { put, select } from 'redux-saga/effects'
import { v4 } from 'uuid'
import Debug from 'debug'
import axios from 'axios'
import _get from 'lodash/get'
import _isEmpty from 'lodash/isEmpty'
import UIActions from '../../actions/ui'
import { getActiveMarket } from '../../selectors/ui'

const debug = Debug('hfui:rx:s:market-hfui:getting CCY article')

export default function* fetchCCYArticle() {
  try {
    const activeMarket = yield select(getActiveMarket)
    const id = _get(activeMarket, 'baseCCYid', null)
    if (!id) {
      return
    }
    const url = `https://api.bitfinex.com/v1/articles?type=zendesk&id=${id}&lang=en-us`
    const { data } = yield axios.get(url)
    const { status, result } = data
    if (status !== 'success' || _isEmpty(result)) {
      throw new Error('Article not found')
    }
    yield put(UIActions.setCCYArticle(result[0]))
  } catch (err) {
    debug('failed to fetch CCY article: %s', err.message)
    yield put(UIActions.changeCCYInfoModalState(false))
    yield put(UIActions.recvNotification({
      mts: Date.now(),
      status: 'error',
      text: err.message,
      cid: v4(),
    }))
  }
}
