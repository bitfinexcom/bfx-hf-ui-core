import _get from 'lodash/get'
import { createSelector } from 'reselect'
import getCcyArticles from './get_ccy_articles'
import getActiveMarketCcyId from './get_active_market_ccy_id'

const EMPTY_OBJ = {}

const getActiveMarketArticle = createSelector(
  [
    getActiveMarketCcyId,
    getCcyArticles,
  ],
  (id, articles) => _get(articles, id, EMPTY_OBJ),
)

export default getActiveMarketArticle
