import defineIndicators from './defineIndicators'

import onPriceUpdate from './onPriceUpdate'
import onUpdateLong from './onUpdateLong'

export default {
  label: 'VWAP ETH/USD Example',

  defineIndicators,
  onPriceUpdate,
  onUpdateLong,
}
