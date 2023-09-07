import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import React from 'react'

const DatePickerPortal = ({ children }) => (
  children ? ReactDOM.createPortal(
    <div className='datepicker__portal'>
      {children}
    </div>,
    document.body,
  ) : null
)

DatePickerPortal.propTypes = {
  children: PropTypes.node
}

DatePickerPortal.defaultProps = {
  children: null
}

export default DatePickerPortal
