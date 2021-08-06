import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { getActiveMarket } from '.'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI
const EMPTY_OBJ = {}

const getActiveMarketArticle = createSelector([getActiveMarket, state => state], (activeMarket, state) => {
  const { baseCCYid } = activeMarket
  return _get(state, `${path}.ccyArticles.${baseCCYid}`, EMPTY_OBJ)
})

export default getActiveMarketArticle
