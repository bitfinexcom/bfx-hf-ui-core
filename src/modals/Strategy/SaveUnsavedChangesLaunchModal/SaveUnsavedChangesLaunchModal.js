import React from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Intent } from '@ufx-ui/core'
import Modal from '../../../ui/Modal'

const SaveUnsavedChangesLaunchModal = ({
  onClose,
  isOpen,
  strategy,
  saveAndLaunch,
  launchWithoutSaving,
}) => {
  const { label } = strategy || {}
  const { t } = useTranslation()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('strategyEditor.unsavedChangesLaunchModalTitle')}
    >
      <p>
        {t('strategyEditor.unsavedChangesModalText', { strategyName: label })}
      </p>
      <Modal.Footer>
        <Modal.Button secondary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button intent={Intent.ERROR} onClick={launchWithoutSaving}>
          {t('ui.launchNoSave')}
        </Modal.Button>
        <Modal.Button primary onClick={saveAndLaunch}>
          {t('ui.saveAndLaunch')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

SaveUnsavedChangesLaunchModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  strategy: PropTypes.shape({
    label: PropTypes.string,
  }),
  saveAndLaunch: PropTypes.func.isRequired,
  launchWithoutSaving: PropTypes.func.isRequired,
}

SaveUnsavedChangesLaunchModal.defaultProps = {
  strategy: {
    label: '',
  },
}

export default SaveUnsavedChangesLaunchModal
