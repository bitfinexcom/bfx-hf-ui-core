import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { getActiveMarket } from '../ui'
import getCcyIdsZendesk from './get_ccy_ids_zendesk'

const getActiveMarketCcyId = createSelector(
  [
    getActiveMarket,
    getCcyIdsZendesk,
  ],
  (activeMarket, ids) => _get(ids, activeMarket?.base),
)

export default getActiveMarketCcyId
