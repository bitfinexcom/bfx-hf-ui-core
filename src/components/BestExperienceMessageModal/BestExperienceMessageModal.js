import React, { memo } from 'react'
import PropTypes from 'prop-types'

import Modal from '../../ui/Modal'

const BestExperienceMessageModal = ({ isOpen, onClose, onSubmit }) => {
  return (
    <Modal
      label='Best experience warning'
      isOpen={isOpen}
      onClose={onClose}
    >
      <p>Web verison of Honey Framework designed for desktops. For having best experience in using application, we strongly recommend using desktop.</p>
      <br />
      <p>Best regards, your Honey Framework&apos;s team!</p>
      <Modal.Footer>
        <Modal.Button primary onClick={onSubmit}>
          I understood. Don&apos;t show me again!
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

BestExperienceMessageModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default memo(BestExperienceMessageModal)
