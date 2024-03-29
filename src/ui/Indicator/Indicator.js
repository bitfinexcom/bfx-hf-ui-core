import React from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'

import './style.css'

const Indicator = ({
  blinking, green, red, white, grey, className,
}) => {
  return (
    <span
      className={clsx('hfui-indicator', className, {
        'blinking-animation': blinking,
        green,
        red,
        white,
        grey,
      })}
    />
  )
}

Indicator.propTypes = {
  blinking: PropTypes.bool,
  green: PropTypes.bool,
  red: PropTypes.bool,
  white: PropTypes.bool,
  grey: PropTypes.bool,
  className: PropTypes.string,
}
Indicator.defaultProps = {
  blinking: false,
  green: false,
  red: false,
  white: false,
  grey: false,
  className: null,
}

export default Indicator
