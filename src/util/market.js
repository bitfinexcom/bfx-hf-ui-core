import _keys from 'lodash/keys'
import _first from 'lodash/first'
import _get from 'lodash/get'

export const getDefaultMarket = (markets) => _get(markets, [_first(_keys(markets))], 'uiID')
