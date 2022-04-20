import React, { memo } from 'react'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import Panel from '../../../ui/Panel'
import { makeShorterLongName } from '../../../util/ui'
import '../style.css'

const MAX_STRATEGY_LABEL_LENGTH = 35

const StrategyEditorPanel = ({
  dark, strategy, moveable, children, removeable, execRunning, strategyDirty, onSideTabChange, preSidebarComponents,
}) => {
  const { t } = useTranslation()
  const { label: strategyName } = strategy || {}
  const strategyDisplayName = strategyDirty
    ? t('strategyEditor.unsavedStartegy')
    : strategyName

  return (
    <Panel
      // label={(
      //   <>
      //     {_size(strategyDisplayName) > MAX_STRATEGY_LABEL_LENGTH ? (
      //       <Tooltip
      //         className='__react-tooltip __react_component_tooltip wide'
      //         content={strategyDisplayName}
      //       >
      //         {makeShorterLongName(
      //           strategyDisplayName,
      //           MAX_STRATEGY_LABEL_LENGTH,
      //         )}
      //       </Tooltip>
      //     ) : (
      //       strategyDisplayName
      //     )}
      //   </>
      // )}
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
  strategyDirty: PropTypes.bool,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }),
  onSideTabChange: PropTypes.func.isRequired,
  preSidebarComponents: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  children: PropTypes.node.isRequired,
}

StrategyEditorPanel.defaultProps = {
  dark: true,
  strategy: {
    label: null,
  },
  moveable: true,
  removeable: true,
  execRunning: false,
  preSidebarComponents: null,
  strategyDirty: false,
}

export default memo(StrategyEditorPanel)
