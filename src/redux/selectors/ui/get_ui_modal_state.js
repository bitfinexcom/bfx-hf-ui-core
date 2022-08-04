import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const getUIModalsState = (state) => _get(state, `${path}.modals`)

const getUIModalStateForKey = createSelector(
  getUIModalsState,
  (modals) => (key) => _get(modals, `is${key}Visible`),
)

export default getUIModalStateForKey
