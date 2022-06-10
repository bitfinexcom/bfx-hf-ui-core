import React, { memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Modal from '../../../ui/Modal'

import './style.css'

const LaunchStrategyModal = ({
  onSubmit,
  onClose,
  isOpen,
}) => {
  const { t } = useTranslation()

  const _onSubmit = useCallback(() => {
    onSubmit()
    onClose()
  }, [onClose, onSubmit])

  return (
    <Modal
      label={t('launchStrategyModal.title')}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={_onSubmit}
      className='launch-strategy-modal'
    >
      <p>{t('launchStrategyModal.body')}</p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button primary onClick={_onSubmit}>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

LaunchStrategyModal.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default memo(LaunchStrategyModal)
