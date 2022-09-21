import React, { memo } from 'react'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'
import { isElectronApp } from '../../redux/config'

import './style.css'

const BadConnection = ({
  changeBadInternetConnectionState, visible,
}) => {
  const { t } = useTranslation()

  const onClose = () => {
    changeBadInternetConnectionState(false)
  }

  const onRestart = () => {
    const path = isElectronApp ? '/index.html' : ''
    location.replace(path) // eslint-disable-line
  }

  const action = isElectronApp ? t('badConnectionModal.reboot') : t('badConnectionModal.restart')

  return (
    <Modal
      label={t('badConnectionModal.title')}
      className='hfui-bad-conn-modal__wrapper'
      isOpen={visible}
      onClose={onClose}
      onSubmit={onRestart}
    >
      <p>{t('badConnectionModal.description')}</p>
      <Modal.Footer>
        <Modal.Button onClick={onRestart} primary>
          {action}
        </Modal.Button>
        <Modal.Button onClick={onClose} primary>
          {t('ui.ok')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

BadConnection.propTypes = {
  changeBadInternetConnectionState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(BadConnection)
