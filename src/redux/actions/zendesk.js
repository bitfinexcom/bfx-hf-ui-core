import zendeskTypes from '../constants/zendesk'

const getCcyIds = () => ({
  type: zendeskTypes.GET_CCY_IDS,
})

const setCcyIds = ids => ({
  type: zendeskTypes.SET_CCY_IDS,
  payload: { ids },
})

const fetchCcyArticle = () => ({
  type: zendeskTypes.FETCH_CCY_ARTICLE,
})

const setCcyArticle = article => ({
  type: zendeskTypes.SET_CCY_ARTICLE,
  payload: { ...article },
})

export default {
  getCcyIds,
  setCcyIds,
  fetchCcyArticle,
  setCcyArticle,
}
