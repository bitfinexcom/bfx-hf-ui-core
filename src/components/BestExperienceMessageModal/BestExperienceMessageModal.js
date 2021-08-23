import React, { memo, useEffect, useState } from 'react'
import _isNil from 'lodash/isNil'

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
  return (
    <Modal
      label='Best experience warning'
      isOpen={isOpen}
      onClose={closeBestExperienceModal}
    >
      <p>Web verison of Honey Framework designed for desktops. For having best experience in using application, we strongly recommend using desktop.</p>
      <p>It&apos;s adviced to use this app in a landscape mode.</p>
      <br />
      <p>Best regards, your Honey Framework&apos;s team!</p>
      <Modal.Footer>
        <Modal.Button primary onClick={onSubmitBestExperienceModal}>
          I understood. Don&apos;t show me again!
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

export default memo(BestExperienceMessageModal)
