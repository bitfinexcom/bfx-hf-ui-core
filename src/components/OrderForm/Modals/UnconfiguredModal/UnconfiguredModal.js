import React, { memo } from 'react'
import PropTypes from 'prop-types'

import OrderFormModal from '../../OrderFormModal'

const UnconfiguredModal = ({ onClick, isPaperTrading, keyExistButNotValid }) => (
  <OrderFormModal
    title={keyExistButNotValid ? 'NOT VALID' : 'NOT CONFIGURED'}
    icon='icon-api'
    onClick={onClick}
    content={(
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a className='submit-keys'>
        {keyExistButNotValid ? 'Update' : 'Submit'}
        {isPaperTrading ? ' Paper Trading ' : ' '}
        API keys
      </a>
    )}
  />
)

UnconfiguredModal.propTypes = {
  onClick: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  keyExistButNotValid: PropTypes.bool,
}

UnconfiguredModal.defaultProps = {
  keyExistButNotValid: false,
}

export default memo(UnconfiguredModal)
