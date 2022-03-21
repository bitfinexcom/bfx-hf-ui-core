import React, { memo } from 'react'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import Button from '../../../ui/Button'

const EmptyContent = ({
  openCreateNewStrategyModal,
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
        <br />
        <p>{t('strategyEditor.orSelectOne')}</p>
      </div>
    </div>
  )
}

EmptyContent.propTypes = {
  openCreateNewStrategyModal: PropTypes.func.isRequired,
}

export default memo(EmptyContent)
