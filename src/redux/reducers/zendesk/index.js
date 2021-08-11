import _reduce from 'lodash/reduce'
import zendeskTypes from '../../constants/zendesk'

const getInitialState = () => ({
  articles: [],
  ccyArticleIdsMap: [],
})

const EMPTY_OBJ = {}

const reducer = (state = getInitialState(), action) => {
  const { type, payload = null } = action
  switch (type) {
    case zendeskTypes.SET_CCY_IDS: {
      const { ids: [idsArray] } = payload
      const newState = _reduce(idsArray, (acc, element) => {
        const [ccy, id] = element
        acc[ccy] = id
        return acc
      }, EMPTY_OBJ)
      return { ...state, ccyArticleIdsMap: newState }
    }
    case zendeskTypes.SET_CCY_ARTICLE: {
      const { id } = payload
      const articles = { ...state.articles, [id]: payload }
      return { ...state, articles }
    }
    default:
      return state
  }
}

export default reducer
