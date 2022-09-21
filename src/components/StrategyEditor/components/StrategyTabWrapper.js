import React from 'react'
import PropTypes from 'prop-types'

const StrategyTabWrapper = ({ children }) => {
  return (
    <div className='hfui-strategyeditor__wrapper'>
      {children}
    </div>
  )
}

StrategyTabWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StrategyTabWrapper
