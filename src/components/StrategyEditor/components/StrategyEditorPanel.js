import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Panel from '../../../ui/Panel'
import '../style.css'

const StrategyEditorPanel = ({
  dark, moveable, children, removeable,
}) => {
  return (
    <Panel
      className='hfui-strategyeditor__panel'
      dark={dark}
      darkHeader={dark}
      moveable={moveable}
      removeable={removeable}
    >
      {children}
    </Panel>
  )
}

StrategyEditorPanel.propTypes = {
  dark: PropTypes.bool,
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  children: PropTypes.node.isRequired,
}

StrategyEditorPanel.defaultProps = {
  dark: true,
  moveable: true,
  removeable: true,
}

export default memo(StrategyEditorPanel)
