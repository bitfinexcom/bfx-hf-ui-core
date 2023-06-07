import { TIME_FRAMES } from 'bfx-hf-util'
import { createSelector } from 'reselect'
import getActiveMarket from './get_active_market'
import { COMPONENT_TYPES } from '../../../components/GridLayout/GridLayout.helpers'

const EMPTY_OBJ = {}

const DEFAULT_STATE = {
  [COMPONENT_TYPES.ORDER_FORM]: {},
  [COMPONENT_TYPES.CHART]: {
    currentTF: TIME_FRAMES.ONE_MINUTE,
    marketDirty: false,
  },
  [COMPONENT_TYPES.ORDER_BOOK]: {
    marketDirty: false,
  },
  [COMPONENT_TYPES.TRADES_TABLE]: {
    marketDirty: false,
  },
  [COMPONENT_TYPES.TRADING_STATE_PANEL]: {
    tab: 3,
  },
}

const getDefaultStateForComponentType = createSelector(
  [
    getActiveMarket,
    (_, type) => type,
  ],
  (activeMarket, type) => {
    switch (type) {
      case COMPONENT_TYPES.ORDER_FORM:
      case COMPONENT_TYPES.TRADING_STATE_PANEL: {
        return DEFAULT_STATE[type]
      }

      case COMPONENT_TYPES.CHART:
      case COMPONENT_TYPES.ORDER_BOOK:
      case COMPONENT_TYPES.TRADES_TABLE: {
        const res = DEFAULT_STATE[type]
        res.currentMarket = activeMarket

        return res
      }

      default: {
        return EMPTY_OBJ
      }
    }
  },
)

export default getDefaultStateForComponentType
