import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import './style.css'

const Indicator = ({
  blinking, green, red, white,
}) => {
  return (
    <span className={clsx('hfui-indicator', {
      'blinking-animation': blinking, green, red, white,
    })}
    />
  )
}

Indicator.propTypes = {
  blinking: PropTypes.bool,
  green: PropTypes.bool,
  red: PropTypes.bool,
  white: PropTypes.bool,
}
Indicator.defaultProps = {
  blinking: false,
  green: false,
  red: false,
  white: false,
}

export default Indicator
