import ReactDOM from 'react-dom'
import React from 'react'

const DatePickerPortal = ({ children }) => (
  children && ReactDOM.createPortal(
    <div className='datepicker__portal'>
      {children}
    </div>,
    document.body,
  )
)

export default DatePickerPortal
