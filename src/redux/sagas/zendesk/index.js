import { takeEvery } from 'redux-saga/effects'
import zendeskTypes from '../../constants/zendesk'
import fetchCcyArticle from './fetch_ccy_article'
import getCcyIds from './get_ccy_ids'

export default function* () {
  yield takeEvery(zendeskTypes.GET_CCY_IDS, getCcyIds)
  yield takeEvery(zendeskTypes.FETCH_CCY_ARTICLE, fetchCcyArticle)
}
