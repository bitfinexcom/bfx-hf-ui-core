import _get from 'lodash/get'
import { createSelector } from 'reselect'
import { REDUCER_PATHS } from '../../config'
import { getIsPaperTrading } from '../ui'

const path = REDUCER_PATHS.WS

const apiKeyStates = (state) => {
  return _get(state, `${path}.auth.apiKeys`, {})
}

const getCurrentModeAPIKeyState = createSelector(
  [getIsPaperTrading, apiKeyStates],
  (isPaperTradingMode, apiKeys) => (isPaperTradingMode ? apiKeys.paper : apiKeys.main),
)

export default getCurrentModeAPIKeyState
