import React, { memo, useEffect, useState } from 'react'
import _isNil from 'lodash/isNil'
import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'
import { MIN_SAFE_WIDTH, HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL } from '../../constants/variables'

const BestExperienceMessageModal = () => {
  const [isOpen, setOpeningState] = useState(false)

  const closeBestExperienceModal = () => setOpeningState(false)

  const onSubmitBestExperienceModal = () => {
    localStorage.setItem(HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL, 'false')
    closeBestExperienceModal()
  }

  useEffect(() => {
    const currentWidth = document.documentElement.clientWidth
    if (currentWidth >= MIN_SAFE_WIDTH) {
      return
    }
    let needToShowModal = localStorage.getItem(HF_UI_WEB_SHOW_BEST_EXPERIENCE_MODAL)
    if (_isNil(needToShowModal)) {
      needToShowModal = true
    } else {
      needToShowModal = JSON.parse(needToShowModal)
    }
    if (!needToShowModal) {
      return
    }
    setTimeout(() => setOpeningState(true), 100)
  }, [])

  const { t } = useTranslation()
  return (
    <Modal
      label={t('bestExperienceMessageModal.title')}
      isOpen={isOpen}
      onClose={closeBestExperienceModal}
      onSubmit={onSubmitBestExperienceModal}
    >
      <p>{t('bestExperienceMessageModal.text1')}</p>
      <p>{t('bestExperienceMessageModal.text2')}</p>
      <br />
      <p>{t('bestExperienceMessageModal.text3')}</p>
      <Modal.Footer>
        <Modal.Button primary onClick={onSubmitBestExperienceModal}>
          {t('ui.dontShowAgain')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

export default memo(BestExperienceMessageModal)
