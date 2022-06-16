import defineIndicators from './defineIndicators'
import defineMeta from './defineMeta'

import onPriceUpdate from './onPriceUpdate'

export default {
  label: 'Basic MACD Cross',
  strategyContent: {
    defineIndicators,
    defineMeta,
    onPriceUpdate,
  },
}
