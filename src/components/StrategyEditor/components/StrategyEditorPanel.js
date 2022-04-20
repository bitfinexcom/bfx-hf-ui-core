import React, { memo } from 'react'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'

import Panel from '../../../ui/Panel'
import '../style.css'

const StrategyEditorPanel = ({
  dark, moveable, children, removeable, execRunning, onSideTabChange, preSidebarComponents,
}) => {
  return (
    <Panel
      className='hfui-strategyeditor__panel'
      dark={dark}
      darkHeader={dark}
      moveable={moveable}
      removeable={removeable}
      onSideTabChange={onSideTabChange}
      extraIcons={[
        execRunning && (
          <Icon
            key='running'
            name='circle-o-notch'
            className='notch-icon'
            spin
          />
        ),
      ]}
      preSidebarComponents={preSidebarComponents}
    >
      {children}
    </Panel>
  )
}

StrategyEditorPanel.propTypes = {
  dark: PropTypes.bool,
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  execRunning: PropTypes.bool,
  onSideTabChange: PropTypes.func.isRequired,
  preSidebarComponents: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  children: PropTypes.node.isRequired,
}

StrategyEditorPanel.defaultProps = {
  dark: true,
  moveable: true,
  removeable: true,
  execRunning: false,
  preSidebarComponents: null,
}

export default memo(StrategyEditorPanel)
