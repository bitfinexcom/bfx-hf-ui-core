import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import Modal from '../../../ui/Modal'
import WSActions from '../../../redux/actions/ws'

const CleanBacktestResultsModal = ({
  onClose,
  isOpen,
  nextStrategy,
  onLoadStrategy,
}) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()

  const clearBacktestOptions = () => {
    dispatch(WSActions.resetBacktestData())
  }
  const onSubmitReset = () => {
    clearBacktestOptions()
    onLoadStrategy(nextStrategy, true)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      label={t('strategyEditor.clearBacktestResultsModalTitle')}
      onSubmit={onClose}
    >
      <p>{t('strategyEditor.clearBacktestResultsModalText')}</p>
      <Modal.Footer>
        <Modal.Button primary onClick={onClose}>
          {t('ui.cancel')}
        </Modal.Button>
        <Modal.Button secondary onClick={onSubmitReset}>
          {t('ui.proceed')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

CleanBacktestResultsModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  nextStrategy: PropTypes.shape({
    label: PropTypes.string,
  }),
  onLoadStrategy: PropTypes.func.isRequired,
}

CleanBacktestResultsModal.defaultProps = {
  nextStrategy: {},
}

export default memo(CleanBacktestResultsModal)
