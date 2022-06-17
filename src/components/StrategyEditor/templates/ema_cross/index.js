import defineIndicators from './defineIndicators'
import defineMeta from './defineMeta'

import onEnter from './onEnter'
import onUpdateLong from './onUpdateLong'

export default {
  label: 'Basic EMA Cross',
  strategyContent: {
    defineIndicators,
    defineMeta,
    onEnter,
    onUpdateLong,
  },
}
