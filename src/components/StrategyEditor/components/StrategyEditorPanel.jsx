import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Panel from '../../../ui/Panel'
import '../style.css'

const StrategyEditorPanel = ({
  moveable, children, removeable, isWideSidebar,
}) => {
  return (
    <Panel
      className='hfui-strategyeditor__panel'
      dark
      darkHeader
      moveable={moveable}
      removeable={removeable}
      isWideSidebar={isWideSidebar}
    >
      {children}
    </Panel>
  )
}

StrategyEditorPanel.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  children: PropTypes.node.isRequired,
  isWideSidebar: PropTypes.bool,
}

StrategyEditorPanel.defaultProps = {
  moveable: true,
  removeable: true,
  isWideSidebar: false,
}

export default memo(StrategyEditorPanel)
