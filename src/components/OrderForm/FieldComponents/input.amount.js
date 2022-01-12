import React from 'react'
import { prepareAmount } from 'bfx-api-node-util'
import NumberInput from './input.number'

const AmountInput = ({ ...props }) => (
  <NumberInput {...props} />
)

AmountInput.processValue = v => +prepareAmount(+v)

AmountInput.validateValue = (v, t) => {
  const numericError = NumberInput.validateValue(v, t)

  if (numericError) {
    return numericError
  }

  if (+v < 0) {
    return t('orderForm.greaterThan0Message')
  }

  return null
}

export default AmountInput
