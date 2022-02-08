import { COMPONENT_IDS } from '../../../components/GridLayout/GridLayout.helpers'

export default {
  [COMPONENT_IDS.TRADING_ORDERBOOK]: {
    currentMarket: {
      contexts: [
        'e',
        'm',
      ],
      restID: 'tBTCUSD',
      wsID: 'tBTCUSD',
      base: 'BTC',
      quote: 'USD',
      uiID: 'BTC/USD',
    },
    sumAmounts: true,
    stackedView: false,
  },
}
