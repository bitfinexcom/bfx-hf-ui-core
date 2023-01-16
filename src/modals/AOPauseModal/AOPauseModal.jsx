import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'
import closeElectronApp from '../../redux/helpers/close_electron_app'

const AOPauseModal = ({
  changeAOPauseModalState, visible, onDontShowAgain: _onDontShowAgain,
}) => {
  const onCancel = () => {
    changeAOPauseModalState(false)
  }

  const onClose = () => {
    changeAOPauseModalState(false)
    setTimeout(closeElectronApp, 100)
  }

  const onDontShowAgain = () => {
    _onDontShowAgain()
    onClose()
  }

  const { t } = useTranslation()

  return (
    <Modal
      label={t('AOPauseModal.title')}
      isOpen={visible}
      onClose={onCancel}
      onSubmit={onClose}
    >
      <p>{t('AOPauseModal.text1')}</p>
      <br />
      <p>{t('AOPauseModal.text2')}</p>
      <br />
      <p>{t('AOPauseModal.text3')}</p>
      <p>{t('AOPauseModal.text4')}</p>
      <br />
      <p>{t('AOPauseModal.text5')}</p>
      <Modal.Footer>
        <Modal.Button
          onClick={onCancel}
        >
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button
          onClick={onDontShowAgain}
        >
          {t('ui.dontShowAgain')}
        </Modal.Button>
        <Modal.Button
          primary
          onClick={onClose}
        >
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

AOPauseModal.propTypes = {
  changeAOPauseModalState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  onDontShowAgain: PropTypes.func.isRequired,
}

AOPauseModal.defaultProps = {}

export default memo(AOPauseModal)
