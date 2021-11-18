import React, { memo, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _map from 'lodash/map'
import _values from 'lodash/values'
import { useTranslation } from 'react-i18next'

import Modal from '../../ui/Modal'
import Dropdown from '../../ui/Dropdown'
import Textarea from '../../ui/Textarea'
import { REASON_TYPES, getReasonLabels } from './FeedbackModal.helpers'

import './style.css'

const MAX_MESSAGE_LENGTH = 500

const BadConnection = ({
  visible, changeFeedbackVisibility, submitFeedback,
}) => {
  const { t } = useTranslation()
  const [reason, setReason] = useState(REASON_TYPES.BUG_REPORT)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const reasonLabels = getReasonLabels(t)

  const onClose = () => {
    changeFeedbackVisibility(false)
    setReason(REASON_TYPES.BUG_REPORT)
    setMessage('')
    setError('')
  }

  const onSubmit = () => {
    if (_isEmpty(message)) {
      setError(t('feedbackModal.errorNoFeedback'))
      return
    }

    const messageSize = _size(message)

    if (messageSize > MAX_MESSAGE_LENGTH) {
      setError(t('feedbackModal.errorFeedbackTooLong', { messageSize, MAX_MESSAGE_LENGTH }))
      return
    }

    submitFeedback(reason, message, t)
    onClose()
  }

  return (
    <Modal
      onClose={onClose}
      isOpen={visible}
      className='hfui-feedback_modal'
      label={t('feedbackModal.feedback')}
    >
      <div className='select-container'>
        <p>
          {t('feedbackModal.selectFeedbackReason')}
        </p>

        <Dropdown
          value={reason}
          className='select'
          placeholder={t('feedbackModal.feedbackReason')}
          onChange={setReason}
          options={_map(_values(REASON_TYPES), type => ({
            label: reasonLabels[type],
            value: type,
          }))}
        />
      </div>

      <Textarea
        label={t('feedbackModal.feedbackMessage')}
        onChange={setMessage}
        className='hfui-feedback_modal-textarea'
        value={message}
      />

      {!_isEmpty(error) && (
        <p className='error'>{error}</p>
      )}

      <Modal.Footer>
        <Modal.Button onClick={onSubmit} primary>
          {t('ui.submitBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

BadConnection.propTypes = {
  visible: PropTypes.bool.isRequired,
  changeFeedbackVisibility: PropTypes.func.isRequired,
  submitFeedback: PropTypes.func.isRequired,
}

export default memo(BadConnection)
