/* eslint-disable jsx-a11y/anchor-has-content */
import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { Trans, useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { DO_NOT_SHOW_DMS_REMOVAL_DISCLAIMER } from '../../redux/reducers/ui'
import useCountdown from '../../hooks/useCountdown'
import { DISCONTINUE_DMS_SUPPORT_ARTICLE_DMS } from '../../redux/config'

const DMSRemovalDisclaimerModal = ({ changeUIModalState, visible }) => {
  const { t } = useTranslation()
  const { countdown, isFinished } = useCountdown(10, visible)

  const onSubmit = () => {
    if (!isFinished) {
      return
    }
    changeUIModalState(UI_MODAL_KEYS.DMS_REMOVAL_DISCLAIMER, false)
    localStorage.setItem(DO_NOT_SHOW_DMS_REMOVAL_DISCLAIMER, 'true')
  }

  return (
    <Modal
      label={t('dmsRemovalDisclaimerModal.title')}
      isCloseButtonShown={isFinished}
      isOpen={visible}
      onClose={onSubmit}
      onSubmit={onSubmit}
    >
      <Trans
        t={t}
        i18nKey='dmsRemovalDisclaimerModal.text'
        components={{
          url: (
            <a
              href={DISCONTINUE_DMS_SUPPORT_ARTICLE_DMS}
              target='_blank'
              rel='noopener noreferrer'
            />
          ),
        }}
      />
      <Modal.Footer>
        <Modal.Button
          onClick={onSubmit}
          primary
          disabled={!isFinished}
        >
          {!isFinished
            ? `${t('ui.closeBtn')} (${countdown})`
            : t('ui.closeBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

DMSRemovalDisclaimerModal.propTypes = {
  changeUIModalState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
}

export default memo(DMSRemovalDisclaimerModal)
