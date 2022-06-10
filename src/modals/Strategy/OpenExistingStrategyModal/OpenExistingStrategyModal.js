import React, { useState, memo, useCallback } from 'react'
import PropTypes from 'prop-types'
import Debug from 'debug'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import _reduce from 'lodash/reduce'
import { useTranslation } from 'react-i18next'

import Modal from '../../../ui/Modal'
import { makeShorterLongName } from '../../../util/ui'
import Dropdown from '../../../ui/Dropdown'

import './style.css'

const debug = Debug('hfui:c:open-existing-strategy-modal')

const MAX_STRATEGY_LABEL_LENGTH = 60

export const dropdownOptionsAdaptor = (options) => {
  return _reduce(options, (nextOptions, { label, id }) => ({
    ...nextOptions,
    label: makeShorterLongName(label, MAX_STRATEGY_LABEL_LENGTH),
    value: id,
  }), {})
}

const OpenExistingStrategyModal = ({
  onClose, strategies, isOpen, onOpen,
}) => {
  const { t } = useTranslation()
  const [strategyID, setStrategyID] = useState(null)
  const [error, setError] = useState('')

  const onSubmit = useCallback(() => {
    if (!strategyID) {
      setError(t('strategyEditor.openStartegyModalNoSelectedError'))
      return
    }
    const strategy = _find(strategies, ({ id }) => id === strategyID)

    if (_isEmpty(strategy)) {
      debug('strategy not found: %s', strategyID)
      return
    }

    onOpen(strategy)
    onClose()
  }, [onClose, onOpen, strategies, strategyID, t])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmit}
      className='hfui-openexistingstrategymodal__wrapper'
      label={t('strategyEditor.openStrategyModalTitle')}
    >
      <Dropdown
        value={strategyID}
        onChange={setStrategyID}
        options={strategies}
        adapter={dropdownOptionsAdaptor}
      />

      {!_isEmpty(error) && (
        <p className='error'>{error}</p>
      )}

      <Modal.Footer>
        <Modal.Button onClick={onSubmit} primary>
          {t('ui.openBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

OpenExistingStrategyModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
  strategies: PropTypes.arrayOf(PropTypes.object).isRequired, // eslint-disable-line
  isOpen: PropTypes.bool,
}

OpenExistingStrategyModal.defaultProps = {
  isOpen: false,
}

export default memo(OpenExistingStrategyModal)
