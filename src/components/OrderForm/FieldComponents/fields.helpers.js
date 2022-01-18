import _map from 'lodash/map'
import _split from 'lodash/split'

// Just in case we ever decide the labels are again valuable
export const CONVERT_LABELS_TO_PLACEHOLDERS = false

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
