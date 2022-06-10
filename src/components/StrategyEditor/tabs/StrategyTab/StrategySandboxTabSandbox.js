import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import StrategiesGridLayout from '../../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  IDE_LAYOUT_CONFIG,
} from '../../components/StrategiesGridLayout.constants'
import IDEPanel from '../../../IDEPanel'
import IDEHelpPanel from '../../../IDEHelpPanel'
import StrategyOptionsPanelSandbox from '../../../StrategyOptionsPanel/StrategyOptionsPanel.Sandbox'

const StrategySandboxTab = (props) => {
  const { onCancelProcess } = props

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return <StrategyOptionsPanelSandbox {...props} />

        case COMPONENTS_KEYS.IDE:
          return <IDEPanel {...props} />
        case COMPONENTS_KEYS.HELP_DOCS:
          return <IDEHelpPanel />

        default:
          return null
      }
    },
    [props],
  )

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={IDE_LAYOUT_CONFIG}
        renderGridComponents={renderGridComponents}
        onCancelProcess={onCancelProcess}
      />
    </div>
  )
}

StrategySandboxTab.propTypes = {
  onCancelProcess: PropTypes.func.isRequired,
}

export default memo(StrategySandboxTab)
