import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { getActiveMarket } from '../ui'
import getCcyIdsZendesk from './get_ccy_ids_zendesk'

const getActiveMarketCcyId = createSelector([getActiveMarket, getCcyIdsZendesk], (activeMarket, ids) => {
  const { base } = activeMarket
  return _get(ids, base, null)
})

export default getActiveMarketCcyId
