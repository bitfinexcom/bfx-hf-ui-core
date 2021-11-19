import { some } from 'lodash'
import { createSelector } from 'reselect'
import {
  getIsAddNewParamModalVisible,
  getIsAOPausedModalVisible,
  getIsCcyInfoModalVisible,
  getIsRefillBalanceModalVisible,
  getIsTradingModeModalVisible,
} from '.'

const getIsAnyModalIsOpen = createSelector([
  getIsAddNewParamModalVisible,
  getIsAOPausedModalVisible,
  getIsCcyInfoModalVisible,
  getIsRefillBalanceModalVisible,
  getIsTradingModeModalVisible],
(...modalsStates) => some(modalsStates, (isVisible) => isVisible))

export default getIsAnyModalIsOpen
