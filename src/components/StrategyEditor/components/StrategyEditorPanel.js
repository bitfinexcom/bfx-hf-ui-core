import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Panel from '../../../ui/Panel'
import '../style.css'

const StrategyEditorPanel = ({
  moveable, children, removeable,
}) => {
  return (
    <Panel
      className='hfui-strategyeditor__panel'
      dark
      darkHeader
      moveable={moveable}
      removeable={removeable}
    >
      {children}
    </Panel>
  )
}

StrategyEditorPanel.propTypes = {
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

StrategyEditorPanel.defaultProps = {
  moveable: true,
  removeable: true,
}

export default memo(StrategyEditorPanel)
