import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Trans, useTranslation } from 'react-i18next'
import { getUIModalStateForKey } from '../../redux/selectors/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import UIActions from '../../redux/actions/ui'
import Modal from '../../ui/Modal'

const LongTermClosedSessionModal = () => {
  const isVisible = useSelector(state => getUIModalStateForKey(
    state,
    UI_MODAL_KEYS.LONG_TERM_CLOSED_SESSION_MODAL,
  ))

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const onClose = () => dispatch(UIActions.changeUIModalState(
    UI_MODAL_KEYS.LONG_TERM_CLOSED_SESSION_MODAL,
    false,
  ))

  return (
    <Modal
      label={t('longTermClosedSessionModal.title')}
      className='hfui-bad-conn-modal__wrapper'
      isOpen={isVisible}
      onClose={onClose}
      onSubmit={onClose}
    >
      <Trans
        t={t}
        i18nKey='longTermClosedSessionModal.description'
        components={{
          bold: <b />,
        }}
      />
      <Modal.Footer>
        <Modal.Button onClick={onClose} primary>
          {t('ui.continueToApp')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

export default LongTermClosedSessionModal
