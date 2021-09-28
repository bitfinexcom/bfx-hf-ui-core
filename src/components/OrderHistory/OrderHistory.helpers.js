import _includes from 'lodash/includes'
import _split from 'lodash/split'

const getPriceFromStatus = (status) => {
  if (!_includes(status, '@')) {
    return '0.00'
  }
  return `${_split(_split(status, '@')?.[1], '(')[0]}`
}

const getFormatedStatus = (status) => {
  return `${_split(status, '@')?.[0]}`
}

export {
  getPriceFromStatus,
  getFormatedStatus,
}
