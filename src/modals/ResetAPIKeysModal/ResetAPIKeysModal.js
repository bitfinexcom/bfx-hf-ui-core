import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'
import {
  PAPER_MODE,
  MAIN_MODE,
} from '../../redux/reducers/ui'

import './style.css'

const ResetAPIKeysModal = ({
  resetAPIKeys, changeResetAPIKeysModalState, liveVisible, paperVisible, authToken,
}) => {
  const { t } = useTranslation()

  const onClose = () => {
    changeResetAPIKeysModalState(false)
  }

  const onSubmit = () => {
    const mode = liveVisible ? MAIN_MODE : PAPER_MODE
    resetAPIKeys(authToken, mode)
    onClose()
  }

  return (
    <Modal
      label={t('resetAPIKeysModal.title')}
      isOpen={liveVisible || paperVisible}
      onClose={onClose}
      onSubmit={onSubmit}
      className='reset_api_keys-modal'
    >
      <p>{t('resetAPIKeysModal.text')}</p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button primary onClick={onSubmit}>
          {t('ui.proceed')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

ResetAPIKeysModal.propTypes = {
  changeResetAPIKeysModalState: PropTypes.func.isRequired,
  resetAPIKeys: PropTypes.func.isRequired,
  liveVisible: PropTypes.bool.isRequired,
  paperVisible: PropTypes.bool.isRequired,
  authToken: PropTypes.string.isRequired,
}

export default memo(ResetAPIKeysModal)
