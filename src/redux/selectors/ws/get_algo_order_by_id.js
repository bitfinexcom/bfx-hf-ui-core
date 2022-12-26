import { createSelector } from 'reselect'
import _find from 'lodash/find'
import { getAllAlgoOrdersArray } from './get_algo_orders'

const getAlgoOrderById = (id) => createSelector(
  [getAllAlgoOrdersArray],
  (aos) => _find(aos, (ao) => ao.gid === id, {}),
)

export default getAlgoOrderById
