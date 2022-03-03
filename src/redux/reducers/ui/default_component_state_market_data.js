import { COMPONENT_IDS } from '../../../components/GridLayout/GridLayout.helpers'

export default {
  [COMPONENT_IDS.MARKET_CHART1]: {
    marketDirty: false,
    currentMarket: {
      contexts: ['e', 'm'],
      restID: 'tBTCUSD',
      wsID: 'tBTCUSD',
      base: 'BTC',
      quote: 'USD',
      uiID: 'BTC/USD',
    },
    currentRange: [1565509335079, 1565595735079],
    currentTF: '1m',
    height: 350,
    indicatorIDs: [],
    indicatorArgs: [],
  },
  [COMPONENT_IDS.MARKET_CHART2]: {
    marketDirty: true,
    currentMarket: {
      contexts: ['e', 'm'],
      uiID: 'ETH/USD',
      restID: 'tETHUSD',
      wsID: 'tETHUSD',
      base: 'ETH',
      quote: 'USD',
    },
    currentRange: [1565509335389, 1565595735389],
    currentTF: '1m',
    height: 350,
    indicatorIDs: [],
    indicatorArgs: [],
  },
  [COMPONENT_IDS.MARKET_TRADES2]: {
    currentMarket: {
      contexts: ['e', 'm'],
      uiID: 'LEO/USD',
      restID: 'tLEOUSD',
      wsID: 'tLEOUSD',
      base: 'LEO',
      quote: 'USD',
    },
    marketDirty: true,
  },
}
