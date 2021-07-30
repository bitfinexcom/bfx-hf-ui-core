const getPriceFromStatus = (status) => {
  if (!status.includes('@')) {
    return '0.00'
  }
  return `${status.split('@')[1].split('(')[0]}`
}

const getFormatedStatus = (status) => {
  return `${status.split('@')[0]}`
}

export {
  getPriceFromStatus,
  getFormatedStatus,
}
