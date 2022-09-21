import defineIndicators from './defineIndicators'

import onEnter from './onEnter'
import onUpdateLong from './onUpdateLong'

export default {
  label: 'VWAP ETH/USD Example',
  strategyContent: {
    defineIndicators,
    onEnter,
    onUpdateLong,
  },
}
