import React from 'react'
import PropTypes from 'prop-types'
import AmountInput from '../../input.amount'

const RecurringAmount = ({ def: { label }, fieldData, ...props }) => {
  const { currency } = fieldData
  const def = {
    label: `${label} ${currency}`,
  }
  return <AmountInput {...props} def={def} />
}

RecurringAmount.processValue = AmountInput.processValue
RecurringAmount.validateValue = AmountInput.validateValue

RecurringAmount.propTypes = {
  def: PropTypes.shape({
    label: PropTypes.string.isRequired,
  }).isRequired,
  fieldData: PropTypes.shape({
    currency: PropTypes.string.isRequired,
  }).isRequired,
}

export default RecurringAmount
