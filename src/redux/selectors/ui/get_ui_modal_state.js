import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'

const path = REDUCER_PATHS.UI

const getUIModalsState = (state) => _get(state, `${path}.modals`)

const getUIModalStateForKey = createSelector(
  getUIModalsState,
  (_, modalKey) => modalKey,
  (modals, modalKey) => _get(modals, `is${modalKey}Visible`),
)

export default getUIModalStateForKey
