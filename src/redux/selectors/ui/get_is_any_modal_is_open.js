import { some } from 'lodash'
import { createSelector } from 'reselect'
import {
  getIsAddNewParamModalVisible,
  getIsAOPausedModalVisible,
  getIsAppSettingsModalVisible,
  getIsCcyInfoModalVisible,
  getIsRefillBalanceModalVisible,
  getIsTradingModeModalVisible,
} from '.'

const getIsAnyModalIsOpen = createSelector(
  [
    getIsAddNewParamModalVisible,
    getIsAOPausedModalVisible,
    getIsAppSettingsModalVisible,
    getIsCcyInfoModalVisible,
    getIsRefillBalanceModalVisible,
    getIsTradingModeModalVisible,
  ],
  (...modalsStates) => some(modalsStates, (isVisible) => isVisible),
)

export default getIsAnyModalIsOpen
