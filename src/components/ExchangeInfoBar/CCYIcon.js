import React, { memo } from 'react'
import PropTypes from 'prop-types'

const CCYIcon = ({ ccy, small }) => (
  <img
    src={`https://static.bitfinex.com/images/icons/${ccy}-alt.svg`}
    alt='coin'
    className={small ? 'ccy-icon-small' : 'ccy-icon'}
  />
)

CCYIcon.defaultProps = {
  small: false,
}

CCYIcon.propTypes = {
  ccy: PropTypes.string.isRequired,
  small: PropTypes.bool,
}

export default memo(CCYIcon)
