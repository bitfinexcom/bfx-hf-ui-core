import defineIndicators from './defineIndicators'
import defineMeta from './defineMeta'

import onPriceUpdate from './onPriceUpdate'
import onUpdateLong from './onUpdateLong'

export default {
  label: 'Basic EMA Cross',

  defineIndicators,
  defineMeta,
  onPriceUpdate,
  onUpdateLong,
}
