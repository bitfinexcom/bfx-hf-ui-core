import React, { memo } from 'react'
import cx from 'clsx'
import PropTypes from 'prop-types'
import OutsideClickHandler from 'react-outside-click-handler'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'

const Item = ({
  isSelected, isDisabled, children, onClick, ...props // eslint-disable-line
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

const StrategyParams = ({
  paramsOpen,
  setParamsOpen,
  startExecution,
  stopExecution,
  onLoadStrategy,
  onExportStrategy,
  onSaveStrategy,
  execRunning,
  onOpenRemoveModal,
  strategy,
  strategyId,
  onOpenCreateStrategyModal,
  onOpenCreateStrategyFromModal,
  onImportStrategy,
}) => {
  const { id = strategyId } = strategy || {}
  const { t } = useTranslation()

  const onClose = () => {
    onLoadStrategy({})
  }

  return (
    <div className='hfui-orderform__ao-settings'>
      {paramsOpen && (
        <OutsideClickHandler onOutsideClick={() => setParamsOpen(false)}>
          <div className='hfui-orderform__ao-settings__menu hfui-strategy__options-panel'>
            <div className='hfui-orderform__ao-settings__menu-buttons' onClick={() => setParamsOpen(false)}>
              <Item onClick={startExecution} isDisabled={execRunning}>
                <Icon name='play' />
                &nbsp;&nbsp;
                {t('strategyEditor.launchStrategy')}
              </Item>
              <Item onClick={stopExecution} isDisabled={!execRunning}>
                <Icon name='stop' />
                &nbsp;&nbsp;
                {t('strategyEditor.stopExec')}
              </Item>
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
              <Item onClick={onSaveStrategy}>
                {t('ui.save')}
              </Item>
              <Item onClick={onExportStrategy}>
                {t('ui.saveAs')}
              </Item>
              <Item onClick={onExportStrategy}>
                {t('strategyEditor.exportStrategy')}
              </Item>
              <Item onClick={onOpenRemoveModal} isDisabled={!id}>
                {t('ui.removeBtn')}
              </Item>
              <Item onClick={onClose}>
                {t('ui.closeBtn')}
              </Item>
            </div>
          </div>
        </OutsideClickHandler>
      )}
    </div>
  )
}

StrategyParams.propTypes = {
  paramsOpen: PropTypes.bool.isRequired,
  setParamsOpen: PropTypes.func.isRequired,
  startExecution: PropTypes.func.isRequired,
  stopExecution: PropTypes.func.isRequired,
  onLoadStrategy: PropTypes.func.isRequired,
  onExportStrategy: PropTypes.func.isRequired,
  onSaveStrategy: PropTypes.func.isRequired,
  execRunning: PropTypes.bool.isRequired,
  onOpenRemoveModal: PropTypes.func.isRequired,
  onImportStrategy: PropTypes.func.isRequired,
  onOpenCreateStrategyModal: PropTypes.func.isRequired,
  onOpenCreateStrategyFromModal: PropTypes.func.isRequired,
  strategy: PropTypes.shape({
    id: PropTypes.string,
  }),
  strategyId: PropTypes.string,
}

StrategyParams.defaultProps = {
  strategyId: '',
  strategy: {
    id: null,
  },
}

export default memo(StrategyParams)
