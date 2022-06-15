import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _find from 'lodash/find'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import MACD from '../../../components/StrategyEditor/templates/macd_cross'
import Modal from '../../../ui/Modal'
import Input from '../../../ui/Input'
import Dropdown from '../../../ui/Dropdown'
import Templates from '../../../components/StrategyEditor/templates'
import Tabs from '../../../ui/Tabs/Tabs'
import { getSortedByTimeStrategies } from '../../../redux/selectors/ws'

import { dropdownOptionsAdaptor, getTabs } from './CreateNewStrategyFromModal.helpers'
import { validateStrategyName } from '../Strategy.helpers'

const CreateNewStrategyFromModalOpen = ({
  onSubmit,
  onClose,
  isOpen,
}) => {
  const savedStrategies = useSelector(getSortedByTimeStrategies)
  const { t } = useTranslation()

  const savedStrategiesExists = !_isEmpty(savedStrategies)
  const tabs = useMemo(() => getTabs(t, savedStrategiesExists), [t, savedStrategiesExists])

  const [label, setLabel] = useState('')
  const [activeTab, setActiveTab] = useState(tabs[0].value)

  const [error, setError] = useState('')
  const [template, setTemplate] = useState(MACD.label)
  const [selectedStrategyLabel, setSelectedStrategyLabel] = useState(null)

  const isTemplatesTabSelected = tabs[0].value === activeTab

  const onSubmitHandler = useCallback(() => {
    const err = validateStrategyName(label, t)
    setError(err)
    if (err) {
      return
    }

    let newStrategy

    if (isTemplatesTabSelected) {
      newStrategy = _find(Templates, (_t) => _t.label === template)
    } else {
      newStrategy = _find(
        savedStrategies,
        (_s) => _s.label === selectedStrategyLabel,
      )
    }

    onSubmit(label, newStrategy)
    onClose()
  }, [isTemplatesTabSelected, label, onClose, onSubmit, savedStrategies, selectedStrategyLabel, t, template])

  useEffect(() => {
    if (savedStrategiesExists) {
      setSelectedStrategyLabel(savedStrategies[0].label)
    }
  }, [savedStrategies, savedStrategiesExists])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmitHandler}
      className='hfui-createnewstrategymodal'
      label={t('strategyEditor.newStrategyFromModalTitle')}
    >
      <div className='hfui-createnewstrategymodal__content'>
        <Tabs tabs={tabs} onTabClick={setActiveTab} activeTab={activeTab} />
        <Input
          type='text'
          placeholder={t('ui.name')}
          value={label}
          onChange={setLabel}
        />
        {isTemplatesTabSelected ? (
          <Dropdown
            value={template}
            onChange={setTemplate}
            options={Templates}
            adapter={dropdownOptionsAdaptor}
          />
        ) : (
          <Dropdown
            value={selectedStrategyLabel}
            onChange={setSelectedStrategyLabel}
            options={savedStrategies}
            adapter={dropdownOptionsAdaptor}
          />
        )}

        {!_isEmpty(error) && <p className='error'>{error}</p>}
      </div>

      <Modal.Footer className='hfui-createnewstrategymodal__footer'>
        <Modal.Button primary onClick={onSubmitHandler}>
          {t('ui.createBtn')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

CreateNewStrategyFromModalOpen.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
}

CreateNewStrategyFromModalOpen.defaultProps = {
  isOpen: true,
}

export default CreateNewStrategyFromModalOpen
