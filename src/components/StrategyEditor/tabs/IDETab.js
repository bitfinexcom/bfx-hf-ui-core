import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import IDEPanel from '../../IDEPanel'
import StrategiesGridLayout from '../components/StrategiesGridLayout'
import { COMPONENTS_KEYS, IDE_LAYOUT_CONFIG } from '../components/StrategiesGridLayout.constants'
import IDENoticePanel from '../../IDENoticePanel'
import IDEHelpPanel from '../../IDEHelpPanel'

const IDETab = (props) => {
  const { strategy: { id } } = props

  const renderGridComponents = useCallback((i) => {
    switch (i) {
      case COMPONENTS_KEYS.OPTIONS:
        return <IDENoticePanel />
      case COMPONENTS_KEYS.IDE:
        return <IDEPanel {...props} key={id} />
      case COMPONENTS_KEYS.HELP_DOCS:
        return <IDEHelpPanel />

      default:
        return null
    }
  }, [props, id])
  return (
    <div className='hfui-strategyeditor__wrapper'>
      <StrategiesGridLayout
        layoutConfig={IDE_LAYOUT_CONFIG}
        renderGridComponents={renderGridComponents}
      />
    </div>
  )
}

IDETab.propTypes = {
  strategy: PropTypes.shape({
    id: PropTypes.string,
  }).isRequired,
}

export default memo(IDETab)
