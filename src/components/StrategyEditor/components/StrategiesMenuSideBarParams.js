import React, { memo, useEffect, useRef } from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import { useSelector, useDispatch } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { getCurrentModeAPIKeyState } from '../../../redux/selectors/ws'
import useHover from '../../../hooks/useHover'
import { getIsPaperTrading, getCurrentMode } from '../../../redux/selectors/ui'
import { changeAppSettingsModalState, setSettingsTab, recvNotification } from '../../../redux/actions/ui'
import { SETTINGS_TABS } from '../../../modals/AppSettingsModal/AppSettingsModal.constants'

const Item = ({
  isSelected, isDisabled, children, onClick, ...props
}) => (
  <div
    className={cx('hfui-orderform__ao-settings__item is-layout', {
      'is-selected': isSelected,
      'is-disabled': isDisabled,
    })}
    onClick={isDisabled ? () => {} : onClick}
    {...props}
  >
    {children}
  </div>
)

Item.propTypes = {
  isSelected: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
}

const StrategyParams = ({
  startExecution,
  stopExecution,
  onLoadStrategy,
  onExportStrategy,
  onSaveStrategy,
  executing,
  onOpenRemoveModal,
  strategy,
  strategyId,
  onOpenCreateStrategyModal,
  onOpenCreateStrategyFromModal,
  onOpenSaveStrategyAsModal,
  onImportStrategy,
  closeParams,
  strategyDirty,
  isTabHovered,
  sidebarOpened,
}) => {
  const { id = strategyId } = strategy || {}
  const { t } = useTranslation()

  const [hoverRef, isHovered] = useHover()

  const timeoutRef = useRef()

  const onClose = () => {
    onLoadStrategy({})
  }

  const currentMode = useSelector(getCurrentMode)
  const apiCredentials = useSelector(getCurrentModeAPIKeyState)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid

  useEffect(() => {
    // We need to use timeout for closing bar because isHovered becomes false,
    // when user move mouse between menu items and subsequently, bar blinks
    if (!isHovered && !isTabHovered) {
      timeoutRef.current = setTimeout(() => closeParams(), 200)
      return
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isHovered, closeParams, isTabHovered])

  const dispatch = useDispatch()
  const openAppSettingsModal = () => dispatch(changeAppSettingsModalState(true))
  const setAPIKeysTab = () => dispatch(setSettingsTab(SETTINGS_TABS.Keys, currentMode))
  const showAPIKeyError = () => dispatch(recvNotification({
    mts: Date.now(),
    status: 'error',
    text: t('notifications.strategyLaunchMissingAPIKey'),
    cid: uuidv4(),
  }))

  const handleLaunchStrategyClick = async () => {
    if (!apiClientConfigured) {
      showAPIKeyError()
      setTimeout(() => {
        setAPIKeysTab()
        openAppSettingsModal()
      }, 250)
    } else {
      startExecution()
    }
  }

  return (
    <div className='hfui-orderform__ao-settings'>
      <div
        className={cx(
          'hfui-orderform__ao-settings__menu hfui-strategy__options-panel',
          {
            'hfui-strategy__options-panel--sidebar-closed': !sidebarOpened,
          },
        )}
        ref={hoverRef}
      >
        <div
          className='hfui-orderform__ao-settings__menu-buttons'
          onClick={closeParams}
        >
          <Item
            onClick={handleLaunchStrategyClick}
            isDisabled={executing}
          >
            <Icon name='play' />
            &nbsp;&nbsp;
            {t('strategyEditor.launchStrategy')}
          </Item>
          {!isPaperTrading && (
            <Item onClick={stopExecution} isDisabled={!executing}>
              <Icon name='stop' />
              &nbsp;&nbsp;
              {t('strategyEditor.stopExec')}
            </Item>
          )}
          <div className='hfui-navbar__layout-settings__separator' />
          <Item onClick={onOpenCreateStrategyModal}>
            {t('strategyEditor.newStrategy2')}
          </Item>
          <Item onClick={onOpenCreateStrategyFromModal}>
            {t('strategyEditor.newStrategyFrom2')}
          </Item>
          <Item onClick={onImportStrategy}>
            {t('strategyEditor.importStrategy')}
          </Item>
          <Item onClick={onSaveStrategy} isDisabled={!strategyDirty}>
            {t('ui.save')}
          </Item>
          <Item onClick={onOpenSaveStrategyAsModal}>{t('ui.saveAs')}</Item>
          <Item onClick={onExportStrategy}>
            {t('strategyEditor.exportStrategy')}
          </Item>
          <Item onClick={onOpenRemoveModal} isDisabled={!id}>
            {t('ui.removeBtn')}
          </Item>
          <Item onClick={onClose}>{t('strategyEditor.closeStrategy')}</Item>
        </div>
      </div>
    </div>
  )
}

StrategyParams.propTypes = {
  startExecution: PropTypes.func.isRequired,
  stopExecution: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  onExportStrategy: PropTypes.func.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
  executing: PropTypes.bool.isRequired,
  onOpenRemoveModal: PropTypes.func.isRequired,
  onImportStrategy: PropTypes.func.isRequired,
  onOpenCreateStrategyModal: PropTypes.func.isRequired,
  onOpenCreateStrategyFromModal: PropTypes.func.isRequired,
  onOpenSaveStrategyAsModal: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    id: PropTypes.string,
  }),
  strategyId: PropTypes.string,
  closeParams: PropTypes.func.isRequired,
  strategyDirty: PropTypes.bool.isRequired,
  isTabHovered: PropTypes.bool.isRequired,
  sidebarOpened: PropTypes.bool.isRequired,
}

StrategyParams.defaultProps = {
  strategyId: '',
  strategy: {
    id: null,
  },
}

export default memo(StrategyParams)
