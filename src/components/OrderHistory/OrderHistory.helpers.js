import _split from 'lodash/split'
import _map from 'lodash/map'

const getFormatedStatus = (status) => {
  return `${_split(status, '@')?.[0]}`
}

export function getNextEndDate(orders) {
  return Math.min(..._map(orders, (o) => o.mtsUpdate - 1))
}

export {
  getFormatedStatus,
}
