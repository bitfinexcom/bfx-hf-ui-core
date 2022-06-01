import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import StrategiesGridLayout from '../../components/StrategiesGridLayout'
import {
  COMPONENTS_KEYS,
  IDE_LAYOUT_CONFIG,
} from '../../components/StrategiesGridLayout.constants'
import IDEPanel from '../../../IDEPanel'
import IDEHelpPanel from '../../../IDEHelpPanel'
import StrategyOptionsPanelSandbox from '../../../StrategyOptionsPanel/StrategyOptionsPanel.Sandbox'

const StrategySandboxTab = (props) => {
  const { executionResults } = props

  const { results } = executionResults

  const hasResults = !_isEmpty(results)

  const renderGridComponents = useCallback(
    (i) => {
      switch (i) {
        case COMPONENTS_KEYS.OPTIONS:
          return (
            <StrategyOptionsPanelSandbox {...props} hasResults={hasResults} />
          )

        case COMPONENTS_KEYS.IDE:
          return <IDEPanel {...props} />
        case COMPONENTS_KEYS.HELP_DOCS:
          return <IDEHelpPanel />

        default:
          return null
      }
    },
    [props, hasResults],
  )

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={IDE_LAYOUT_CONFIG}
        renderGridComponents={renderGridComponents}
      />
    </div>
  )
}

StrategySandboxTab.propTypes = {
  executionResults: PropTypes.shape({
    // eslint-disable-next-line react/forbid-prop-types
    results: PropTypes.object,
  }).isRequired,
}

export default memo(StrategySandboxTab)
