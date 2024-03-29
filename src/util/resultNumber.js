import React from 'react'

import _toNumber from 'lodash/toNumber'
import _isNaN from 'lodash/isNaN'
import _isBoolean from 'lodash/isBoolean'
import { isFiat, formatNumber } from '@ufx-ui/utils'
import { Tooltip } from '@ufx-ui/core'
import getQuotePrefix from './quote_prefix'
import numberExponentToLarge from './numberExponentToLarge'

const FIAT_MAX_DECIMALS = 2
const CRYPTO_MAX_DECIMALS = 8

const appendUnit = (value, unit, prefix) => {
  if (prefix) {
    return unit + value
  }

  return `${value} ${unit}`
}

const getSmallestUnit = (isFiatValue) => (isFiatValue ? 0.01 : 0.00000001)

const resultNumber = (value, ccy, isPositive, isPercent = false) => {
  if (_isNaN(value)) {
    return '--'
  }

  const val = _toNumber(value)
  const isZero = val === 0
  const _isPositive = _isBoolean(isPositive) ? isPositive : val > 0

  let maxDecimals = FIAT_MAX_DECIMALS
  const isCcyFiat = isFiat(ccy)
  if (ccy) {
    maxDecimals = isCcyFiat ? FIAT_MAX_DECIMALS : CRYPTO_MAX_DECIMALS
  }

  const decimalNumberString = formatNumber({
    number: val,
    decimals: maxDecimals,
  })
  const decimalNumberWithoutRounded = numberExponentToLarge(val)

  const quotePrefix = !ccy ? '' : getQuotePrefix(ccy) || ccy

  const smallestUnit = getSmallestUnit(isCcyFiat || !ccy)
  const resultValueWithCcySign = Number(decimalNumberString)
    ? appendUnit(decimalNumberString, quotePrefix, isCcyFiat)
    : isZero
      ? appendUnit(0, quotePrefix, isCcyFiat)
      : _isPositive
        ? appendUnit(`<${smallestUnit}`, quotePrefix, isCcyFiat)
        : appendUnit(`>-${smallestUnit}`, quotePrefix, isCcyFiat)

  const style = { color: _isPositive ? 'green' : 'red' }

  return (
    <Tooltip
      content={(
        <span style={style}>
          {isPercent ? resultValueWithCcySign : decimalNumberWithoutRounded}
        </span>
      )}
      placement='top'
    >
      <span style={style}>{resultValueWithCcySign}</span>
    </Tooltip>
  )
}

export default resultNumber
