import { put, select } from 'redux-saga/effects'
import { v4 } from 'uuid'
import Debug from 'debug'
import axios from 'axios'
import _isEmpty from 'lodash/isEmpty'
import UIActions from '../../actions/ui'
import { getActiveMarketCcyId } from '../../selectors/zendesk'
import zendeskActions from '../../actions/zendesk'
import { getCurrentLanguage } from '../../selectors/ui'

const debug = Debug('hfui:rx:s:market-hfui:getting ccy article')

export default function* fetchCcyArticle() {
  try {
    const id = yield select(getActiveMarketCcyId)
    const language = yield select(getCurrentLanguage)
    const url = `${process.env.REACT_APP_UFX_API_URL}/v1/articles?type=zendesk&id=${id}&lang=${language}`
    const { data } = yield axios.get(url)
    const { status, data: result } = data
    if (status !== 'success' || _isEmpty(result)) {
      throw new Error('Article not found')
    }
    yield put(zendeskActions.setCcyArticle(result[0]))
  } catch (err) {
    debug('failed to fetch ccy article: %s', err.message)
    yield put(UIActions.changeCcyInfoModalState(false))
    yield put(UIActions.recvNotification({
      mts: Date.now(),
      status: 'error',
      text: err.message,
      cid: v4(),
    }))
  }
}
