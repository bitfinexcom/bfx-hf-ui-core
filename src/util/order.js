import _includes from 'lodash/includes'
import _replace from 'lodash/replace'
import _toLower from 'lodash/toLower'
import _toUpper from 'lodash/toUpper'
import _find from 'lodash/find'

export const ORDER_CONTEXT = {
  EXCHANGE: 'EXCHANGE',
  MARGIN: 'MARGIN',
  DERIVATIVE: 'DERIVATIVE',
}

export const orderContext = ({
  type, symbol, oco,
}, isDerivativePair, t, orders) => {
  const prefix = oco ? 'OCO ' : ''
  const isExchange = _includes(type, ORDER_CONTEXT.EXCHANGE)
  const _type = _replace(_toLower(type), /(exchange )/i, '')
  let { label } = _find(orders, ({ id }) => id === _type) || { label: _type }
  label = `${prefix}${label}`

  if (isDerivativePair(symbol)) return _toUpper(`${t('orderContexts.funding')} ${label}`)
  return isExchange
    ? _toUpper(`${t('orderContexts.exchange')} ${label}`)
    : _toUpper(`${t('orderContexts.margin')} ${label}`)
}

export const getAOContext = (rowData) => {
  return rowData?.args?._futures ? ORDER_CONTEXT.DERIVATIVE : rowData?.args?._margin ? ORDER_CONTEXT.MARGIN : ORDER_CONTEXT.EXCHANGE
}
