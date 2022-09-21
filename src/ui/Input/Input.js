import React, { useEffect, useRef, useState } from 'react'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'

import { getLengthAfterPoint } from './Input.helpers'
import './style.css'

const Input = ({
  type,
  className,
  onChange,
  disabled,
  value,
  placeholder,
  label,
  autocomplete,
  style,
  min,
  max,
  percentage,
  shouldBeAutofocused,
  indicator,
}) => {
  const [isHidden, setIsHidden] = useState(true)
  const inputRef = useRef()

  const isPlaceholderValid = typeof placeholder !== 'boolean' || typeof placeholder === 'undefined'

  const toggleShow = () => setIsHidden(!isHidden)

  const onInputChangeHandler = (e) => {
    const { value: _value } = e.target
    if (percentage) {
      const number = Number(_value)

      if (
        !Number.isNaN(number)
        && number <= max
        && number >= 0
        && getLengthAfterPoint(_value) <= 2
      ) {
        onChange(_value)
      }
    } else {
      onChange(_value)
    }
  }

  useEffect(() => {
    if (!shouldBeAutofocused || !inputRef.current) {
      return
    }
    inputRef.current.focus()
  }, [shouldBeAutofocused, inputRef])

  if (type === 'password') {
    return (
      <div className='hfui-input'>
        <input
          type={isHidden ? 'password' : 'text'}
          placeholder={isPlaceholderValid ? placeholder : null}
          className={className}
          onChange={onInputChangeHandler}
          value={value}
          ref={inputRef}
        />
        <button
          className='field-icon'
          type='button'
          onClick={toggleShow}
        >
          {isHidden ? <Icon name='eye' /> : <Icon name='eye-slash' />}
        </button>
      </div>
    )
  }
  return (
    <div className='hfui-input'>
      {label && <p>{label}</p>}

      <input
        type={type}
        autoComplete={autocomplete}
        className={className}
        onChange={onInputChangeHandler}
        placeholder={isPlaceholderValid ? placeholder : null}
        disabled={disabled}
        style={style}
        value={value}
        min={min}
        max={max}
        ref={inputRef}
      />
      {indicator && (
        <span className='hfui-input-indicator'>
          {indicator}
        </span>
      )}
    </div>
  )
}

Input.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  autocomplete: PropTypes.string,
  value: PropTypes.any, // eslint-disable-line
  placeholder: PropTypes.string,
  label: PropTypes.string,
  percentage: PropTypes.bool,
  style: PropTypes.objectOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  ),
  min: PropTypes.number,
  max: PropTypes.number,
  shouldBeAutofocused: PropTypes.bool,
  indicator: PropTypes.string,
}

Input.defaultProps = {
  onChange: () => {},
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  style: {},
  value: '',
  placeholder: '',
  label: '',
  className: '',
  disabled: false,
  autocomplete: 'off',
  percentage: false,
  shouldBeAutofocused: false,
  indicator: null,
}

export default Input
