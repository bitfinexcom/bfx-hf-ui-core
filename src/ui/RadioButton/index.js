import React, { memo } from 'react'
import PropTypes from 'prop-types'

import './style.css'

const RadioButton = ({
  onChange, value, label, id, uppercase, disabled,
}) => (
  <div className='hfui-radio-button'>
    <input
      type='radio'
      id={id}
      checked={value}
      onChange={onChange}
      disabled={disabled}
    />
    <label
      style={{
        textTransform: uppercase ? 'uppercase' : 'auto',
      }}
      className='radio-label'
      htmlFor={id}
    >
      {label}
    </label>
  </div>
)

RadioButton.propTypes = {
  id: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.bool,
  uppercase: PropTypes.bool,
  label: PropTypes.string,
  disabled: PropTypes.bool,
}

RadioButton.defaultProps = {
  id: '',
  uppercase: false,
  onChange: () => {},
  value: '',
  label: '',
  disabled: false,
}

export default memo(RadioButton)
