import _includes from 'lodash/includes'
import _replace from 'lodash/replace'

export const ORDER_CONTEXT = {
  EXCHANGE: 'EXCHANGE',
  MARGIN: 'MARGIN',
  DERIVATIVE: 'DERIVATIVE',
}

export const orderContext = ({ type, symbol, oco }, isDerivativePair) => {
  const prefix = (oco) ? 'OCO ' : ''
  const isExchange = _includes(type, 'EXCHANGE')
  const _type = prefix + _replace(type, 'EXCHANGE', '')
  if (isDerivativePair(symbol)) return `${ORDER_CONTEXT.DERIVATIVE} ${_type}`

  return isExchange
    ? `${ORDER_CONTEXT.EXCHANGE} ${_type}`
    : `${ORDER_CONTEXT.MARGIN} ${_type}`
}

export const getAOContext = (rowData) => {
  return rowData?.args?._futures ? ORDER_CONTEXT.DERIVATIVE : rowData?.args?._margin ? ORDER_CONTEXT.MARGIN : ORDER_CONTEXT.EXCHANGE
}
