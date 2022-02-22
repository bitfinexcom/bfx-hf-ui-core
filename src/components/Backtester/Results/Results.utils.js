import React from 'react'

import { isFiat } from '@ufx-ui/utils'
import _toNumber from 'lodash/toNumber'
import { Tooltip } from '@ufx-ui/core'
import numberExponentToLarge from '../../../util/numberExponentToLarge'
import getQuotePrefix from '../../../util/quote_prefix'

const FIAT_MAX_DECIMALS = 2
const CRYPTO_MAX_DECIMALS = 8

export const resultNumber = (value, ccy) => {
  const val = _toNumber(value)
  const isZero = val === 0
  const isPositive = val > 0

  let maxDecimals = FIAT_MAX_DECIMALS
  const isCcyFiat = isFiat(ccy)

  if (ccy) {
    maxDecimals = isCcyFiat ? FIAT_MAX_DECIMALS : CRYPTO_MAX_DECIMALS
  }
  let roundedNumber = Number(val.toFixed(maxDecimals))

  if (Number.isNaN(roundedNumber)) {
    roundedNumber = 0
  }

  const decimalNumberString = numberExponentToLarge(roundedNumber)
  const decimalNumberWithoutRounded = numberExponentToLarge(val)

  if (!ccy) {
    const nonCcyValue = Number(decimalNumberString)
      ? decimalNumberString
      : isZero
        ? '0'
        : isPositive
          ? '<0.01'
          : '>-0.01'

    return (
      <Tooltip content={decimalNumberWithoutRounded} placement='top'>
        <span>{nonCcyValue}</span>
      </Tooltip>
    )
  }
  let resultValueWithCcySign = isCcyFiat

  if (isCcyFiat) {
    const quotePrefix = getQuotePrefix(ccy)
    resultValueWithCcySign = Number(decimalNumberString)
      ? `${quotePrefix}${decimalNumberString}`
      : isZero
        ? `${quotePrefix}0`
        : isPositive ? `${quotePrefix}<0.01` : `${quotePrefix}>-0.01`
  } else {
    resultValueWithCcySign = Number(decimalNumberString)
      ? `${decimalNumberString} ${ccy}`
      : isZero
        ? `0 ${ccy}`
        : isPositive ? `<0.00000001 ${ccy}` : `>-0.00000001 ${ccy}`
  }

  if (roundedNumber <= 0) {
    return (
      <Tooltip
        content={
          <span style={{ color: 'red' }}>{decimalNumberWithoutRounded}</span>
        }
        placement='top'
      >
        <span style={{ color: 'red' }}>{resultValueWithCcySign}</span>
      </Tooltip>
    )
  }
  return (
    <Tooltip
      content={
        <span style={{ color: 'green' }}>{decimalNumberWithoutRounded}</span>
      }
      placement='top'
    >
      <span style={{ color: 'green' }}>{resultValueWithCcySign}</span>
    </Tooltip>
  )
}
