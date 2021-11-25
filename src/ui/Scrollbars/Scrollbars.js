import React from 'react'
import PropTypes from 'prop-types'

import PerfectScrollbar from 'react-perfect-scrollbar'
import 'react-perfect-scrollbar/dist/css/styles.css'

import './style.css'

const scrollbarOptions = {
  minScrollbarLength: 25,
  maxScrollbarLength: 100,
  handlers: ['click-rail', 'keyboard', 'wheel', 'touch'],
}

const Scrollbars = ({ children, ...rest }) => (
  <PerfectScrollbar
    options={scrollbarOptions}
    {...rest}
  >
    {children}
  </PerfectScrollbar>
)

Scrollbars.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Scrollbars
