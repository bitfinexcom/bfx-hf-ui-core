import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'
import { getUIModalStateForKey } from '../../redux/selectors/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { changeUIModalState } from '../../redux/actions/ui'

import SessionList from './SessionList'

import './style.css'

const CloseSessionModal = () => {
  const isOpen = useSelector((state) => getUIModalStateForKey(state, UI_MODAL_KEYS.CLOSE_SESSION_MODAL))

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onClose = () => dispatch(changeUIModalState(UI_MODAL_KEYS.CLOSE_SESSION_MODAL, false))

  return (
    <Modal
      label={t('closeSessionModal.title')}
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={() => {}}
      width={600}
    >
      <p className='close-session-modal__description'>
        {t('closeSessionModal.text_1')}
      </p>
      <SessionList onModalClose={onClose} />
      <p>{t('closeSessionModal.text_2')}</p>
      <Modal.Footer>
        <Modal.Button primary onClick={() => {}}>
          {t('closeSessionModal.submitButton')}
        </Modal.Button>
        <Modal.Button secondary onClick={onClose}>
          {t('closeSessionModal.closeButton')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

export default CloseSessionModal
