import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import Button from '../../../ui/Button'

const EmptyContent = ({
  openCreateNewStrategyModal,
  openCreateNewStrategyFromModal,
}) => {
  const { t } = useTranslation()

  return (
    <div className='hfui-strategyeditor__without-strategies'>
      <div>
        <Button
          green
          className='hfui-strategy-button'
          onClick={openCreateNewStrategyModal}
          label={[
            <i key='icon' className='icon-strategy-editor-passive' />,
            <p key='text'>{t('strategyEditor.newStrategy')}</p>,
          ]}
        />
        <Button
          green
          className='hfui-strategy-button'
          onClick={openCreateNewStrategyFromModal}
          label={[
            <Icon name='folder' key='icon' />,
            <p key='text'>{t('strategyEditor.newStrategyFrom')}</p>,
          ]}
        />
        <br />
        <div className='select-one-text'>{t('strategyEditor.orSelectOne')}</div>
      </div>
    </div>
  )
}

EmptyContent.propTypes = {
  openCreateNewStrategyModal: PropTypes.func.isRequired,
  openCreateNewStrategyFromModal: PropTypes.func.isRequired,
}

export default memo(EmptyContent)
