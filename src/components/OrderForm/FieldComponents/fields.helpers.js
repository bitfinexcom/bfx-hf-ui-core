import { getSymbols } from '@ufx-ui/utils'
import _map from 'lodash/map'
import _split from 'lodash/split'

// Just in case we ever decide the labels are again valuable
export const CONVERT_LABELS_TO_PLACEHOLDERS = false

export const ALIAS_MAX_CHARS = 240

export const renderString = (str, renderData) => {
  const tokens = _split(str, ' ')

  return _map(tokens, (t) => {
    if (t[0] !== '$') {
      return t
    }

    const key = t.substring(1)

    return renderData[key] || ''
  }).join(' ')
}

export const getCurrencyDefinition = (currency, symbol) => {
  const [base, quote] = getSymbols(symbol)

  if (currency === base) {
    return '$BASE'
  }
  if (currency === quote) {
    return '$QUOTE'
  }
  return currency
}
