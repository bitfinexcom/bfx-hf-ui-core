import React, { memo } from 'react'
import PropTypes from 'prop-types'

const CCYIcon = ({ ccy }) => (
  <img
    src={`https://static.bitfinex.com/images/icons/${ccy}.svg`}
    alt='coin'
    className='ccy-icon'
  />
)

CCYIcon.propTypes = {
  ccy: PropTypes.string.isRequired,
}

export default memo(CCYIcon)
