import React, { memo, useCallback } from 'react'
import IDEPanel from '../../IDEPanel'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import { COMPONENTS_KEYS, IDE_LAYOUT_CONFIG } from '../components/StrategiesGridLayout.constants'
import IDEOptionsPanel from '../../IDEOptionsPanel'
import IDEHelpPanel from '../../IDEHelpPanel'

const IDETab = (props) => {
  const renderGridComponents = useCallback((i) => {
    switch (i) {
      case COMPONENTS_KEYS.OPTIONS:
        return <IDEOptionsPanel {...props} />
      case COMPONENTS_KEYS.IDE:
        return <IDEPanel {...props} />
      case COMPONENTS_KEYS.HELP_DOCS:
        return <IDEHelpPanel />

      default:
        return null
    }
  }, [props])
  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={IDE_LAYOUT_CONFIG}
        renderGridComponents={renderGridComponents}
      />
    </div>
  )
}

export default memo(IDETab)
