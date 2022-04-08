import React, { memo } from 'react'
import { Icon } from 'react-fa'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import { Tooltip } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'

import Panel from '../../../ui/Panel'
import { makeShorterLongName } from '../../../util/ui'
import Button from '../../../ui/Button'

import '../style.css'

const MAX_STRATEGY_LABEL_LENGTH = 35

const StrategyEditorPanel = ({
  dark,
  strategy,
  onRemove,
  moveable,
  children,
  strategyId,
  removeable,
  execRunning,
  strategyDirty,
  onSideTabChange,
  preSidebarComponents,
  onSaveStrategy,
  onOpenSelectModal,
  onOpenCreateModal,
  onOpenRemoveModal,
  strategies,
  onExportStrategy,
  onImportStrategy,
}) => {
  const { t } = useTranslation()
  const { id = strategyId, label: strategyName } = strategy || {}
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
      onRemove={onRemove}
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
      // headerComponents={(
      //   <div className='hfui-strategyeditor__header'>
      //     <div className='header__buttons-container'>
      //       <Button
      //         className='hfui-open-strategy__btn'
      //         onClick={onOpenSelectModal}
      //         disabled={strategyDirty || _isEmpty(strategies)}
      //         label={[
      //           <i key='icon' className='icon-open' />,
      //           <p key='text'>{t('ui.openBtn')}</p>,
      //         ]}
      //       />
      //       <Button
      //         green
      //         className='hfui-create-strategy__btn'
      //         onClick={onOpenCreateModal}
      //         label={[
      //           <i key='icon' className='icon-strategy-editor-passive' />,
      //           <p key='text'>{t('strategyEditor.newStrategy')}</p>,
      //         ]}
      //       />
      //       {_isEmpty(strategy) ? (
      //         <Button
      //           className='hfui-remove-strategy__btn'
      //           onClick={onImportStrategy}
      //           label={[
      //             <Icon key='icon' name='download' />,
      //             <p key='text'>{t('ui.import')}</p>,
      //           ]}
      //         />
      //       ) : (
      //         <>
      //           <Button
      //             onClick={onSaveStrategy}
      //             disabled={!strategyDirty}
      //             label={[
      //               <i key='icon' className='icon-save' />,
      //               <p key='text'>{t('ui.save')}</p>,
      //             ]}
      //           />
      //           <Button
      //             className='hfui-remove-strategy__btn'
      //             onClick={onOpenRemoveModal}
      //             disabled={!id}
      //             label={[
      //               <i key='icon' className='icon-delete1' />,
      //               <p key='text'>{t('ui.removeBtn')}</p>,
      //             ]}
      //           />
      //           <Button
      //             className='hfui-remove-strategy__btn'
      //             onClick={onExportStrategy}
      //             label={[
      //               <Icon key='icon' name='upload' />,
      //               <p key='text'>{t('ui.export')}</p>,
      //             ]}
      //           />
      //         </>
      //       )}
      //     </div>
      //   </div>
      // )}
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
  strategyId: PropTypes.string,
  strategyDirty: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    id: PropTypes.string,
    label: PropTypes.string,
  }),
  onSaveStrategy: PropTypes.func.isRequired,
  onOpenSelectModal: PropTypes.func.isRequired,
  onOpenCreateModal: PropTypes.func.isRequired,
  onOpenRemoveModal: PropTypes.func.isRequired,
  onExportStrategy: PropTypes.func.isRequired,
  onImportStrategy: PropTypes.func.isRequired,
  onSideTabChange: PropTypes.func.isRequired,
  preSidebarComponents: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  children: PropTypes.node.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired,
}

StrategyEditorPanel.defaultProps = {
  dark: true,
  strategyId: '',
  strategy: {
    id: null,
    label: null,
  },
  moveable: true,
  removeable: true,
  execRunning: false,
  preSidebarComponents: null,
  strategyDirty: false,
}

export default memo(StrategyEditorPanel)
