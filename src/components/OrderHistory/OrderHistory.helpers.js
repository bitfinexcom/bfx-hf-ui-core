import _split from 'lodash/split'

const getFormatedStatus = (status) => {
  return `${_split(status, '@')?.[0]}`
}

export {
  getFormatedStatus,
}
