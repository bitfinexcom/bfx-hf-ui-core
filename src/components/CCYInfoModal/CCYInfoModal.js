import React, { memo } from 'react'
import PropTypes from 'prop-types'
import Modal from '../../ui/Modal'

const CCYInfoModal = ({
  onClose, title, body, isModalVisible,
}) => {
  console.log(isModalVisible)
  return (
    <Modal
      title='qweqwewqewqewq'
      onClose={onClose}
      isOpen={isModalVisible}
    >
      <div>
        qweqwewqewqewqewqeqw
      </div>
    </Modal>
  )
}

CCYInfoModal.propTypes = {
  isModalVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,

}

export default memo(CCYInfoModal)
