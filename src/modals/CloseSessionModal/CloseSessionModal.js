import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useSelector, useDispatch } from 'react-redux'
import { useTranslation } from 'react-i18next'
import _delay from 'lodash/delay'
import { Spinner } from '@ufx-ui/core'
import Modal from '../../ui/Modal'
import { getUIModalStateForKey } from '../../redux/selectors/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { LOG_LEVELS } from '../../constants/logging'
import useToggle from '../../hooks/useToggle'

import SessionList from './SessionList'
import AlgoOrderDetailsModal from '../AlgoOrderDetailsModal'

import './style.css'

const CloseSessionModal = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [activeAlgoOrder, setActiveAlgoOrder] = useState(null)
  const [isDetailsModalOpen,, openDetailsModal, closeDetailsModal] = useToggle(false)

  const isOpen = useSelector((state) => getUIModalStateForKey(state, UI_MODAL_KEYS.CLOSE_SESSION_MODAL))

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onClose = () => {
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CLOSE_SESSION_MODAL, false))
  }

  const onCloseAndLog = () => {
    onClose()
    dispatch(UIActions.logInformation('Closing session terminated - user did not cancel active orders or strategies.', LOG_LEVELS.INFO, 'close_session_progress'))
  }

  const onSubmit = () => {
    dispatch(WSActions.send(['app.safe_close']))
    setIsLoading(true)

    // Timeout, if the message allowing the application to close is not received
    setTimeout(() => {
      setIsLoading(false)
      onClose()

      dispatch(UIActions.logInformation('Can\'t close the session: the message allowing the application to close was not received.', LOG_LEVELS.ERROR, 'close_session_failed'))
      dispatch(UIActions.recvNotification({
        mts: Date.now(),
        status: 'error',
        text: t('closeSessionModal.error'),
        cid: uuidv4(),
      }))
    }, 10000)
  }

  const openAODetailsModal = (gid) => {
    onClose()
    setActiveAlgoOrder(gid)
    openDetailsModal()
  }

  const AODetailsModalClose = () => {
    closeDetailsModal()
    dispatch(UIActions.changeUIModalState(UI_MODAL_KEYS.CLOSE_SESSION_MODAL, true))
    _delay(setActiveAlgoOrder, 500, null)
  }

  return (
    <>
      <Modal
        label={t('closeSessionModal.title')}
        isOpen={isOpen}
        onClose={onCloseAndLog}
        onSubmit={onSubmit}
        width={600}
      >
        {isLoading ? <Spinner /> : (
          <div>
            <p className='close-session-modal__description'>
              {t('closeSessionModal.text_1')}
            </p>
            <SessionList onModalClose={onClose} openAODetailsModal={openAODetailsModal} />
            <p>{t('closeSessionModal.text_2')}</p>
          </div>
        )}
        <Modal.Footer>
          <Modal.Button primary onClick={onSubmit} disabled={isLoading}>
            {t('closeSessionModal.submitButton')}
          </Modal.Button>
          <Modal.Button secondary onClick={onCloseAndLog} disabled={isLoading}>
            {t('closeSessionModal.closeButton')}
          </Modal.Button>
        </Modal.Footer>
      </Modal>
      <AlgoOrderDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={AODetailsModalClose}
        algoOrderId={activeAlgoOrder}
      />
    </>
  )
}

export default CloseSessionModal
