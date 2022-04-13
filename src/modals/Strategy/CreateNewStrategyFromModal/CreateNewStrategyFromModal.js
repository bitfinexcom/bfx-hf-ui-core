import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import _map from 'lodash/map'
import _find from 'lodash/find'
import { useTranslation } from 'react-i18next'
import { Icon } from 'react-fa'
import { useSelector } from 'react-redux'
import { MAX_STRATEGY_LABEL_LENGTH as MAX_LABEL_LENGTH } from '../../../constants/variables'
import MACD from '../../../components/StrategyEditor/templates/macd_cross'
import Modal from '../../../ui/Modal'
import Input from '../../../ui/Input'
import Dropdown from '../../../ui/Dropdown'
import Templates from '../../../components/StrategyEditor/templates'
import Tabs from '../../../ui/Tabs/Tabs'
import { getSortedByTimeStrategies } from '../../../redux/selectors/ws'

const CreateNewStrategyFromModalOpen = ({
  onSubmit,
  onClose,
  gaCreateStrategy,
  isOpen,
}) => {
  const tabs = useMemo(() => {
    return [
      { label: 'Template', value: 'templ', Icon: <Icon name='file' /> },
      { label: 'From saved', value: 'saved', Icon: <Icon name='file-code-o' /> },
    ]
  }, [])

  const savedStrategies = useSelector(getSortedByTimeStrategies)

  const [label, setLabel] = useState('')
  const [activeTab, setActiveTab] = useState(tabs[0].value)

  const [error, setError] = useState('')
  const [template, setTemplate] = useState(MACD.label)
  const [selectedStrategyLabel, setSelectedStrategyLabel] = useState(savedStrategies[0].label)

  const isTemplatesTabSelected = tabs[0].value === activeTab

  const { t } = useTranslation()

  const onSubmitHandler = () => {
    const labelSize = _size(label)

    if (_isEmpty(label)) {
      setError(t('strategyEditor.newStrategyModalEmptyError'))
      return
    }

    if (labelSize > MAX_LABEL_LENGTH) {
      setError(
        t('strategyEditor.newStrategyModalLongError', {
          labelSize,
          MAX_LABEL_LENGTH,
        }),
      )
      return
    }

    gaCreateStrategy()

    let newStrategy

    if (isTemplatesTabSelected) {
      newStrategy = _find(Templates, _t => _t.label === template)
    } else {
      newStrategy = _find(savedStrategies, _s => _s.label === selectedStrategyLabel)
    }

    onSubmit(label, newStrategy)

    onClose()
  }

  const templatesOptions = useMemo(() => _map(Templates, _t => ({
    label: _t.label,
    value: _t.label,
  })), [])

  const savedStrategiesOptions = useMemo(() => _map(savedStrategies, s => ({
    label: s.label,
    value: s.label,
  })), [savedStrategies])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onSubmitHandler}
      className='hfui-createnewstrategymodal'
      label={t('strategyEditor.newStrategyFromModalTitle')}
    >
      <div className='hfui-createnewstrategymodal__content'>
        <Tabs
          tabs={tabs}
          onTabClick={setActiveTab}
          activeTab={activeTab}
        />
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
            options={templatesOptions}
          />
        ) : (
          <Dropdown
            value={selectedStrategyLabel}
            onChange={setSelectedStrategyLabel}
            options={savedStrategiesOptions}
          />
        )}

        {!_isEmpty(error) && (
        <p className='error'>{error}</p>
        )}

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
  gaCreateStrategy: PropTypes.func,
  isOpen: PropTypes.bool,
}

CreateNewStrategyFromModalOpen.defaultProps = {
  gaCreateStrategy: () => { },
  isOpen: true,
}

export default CreateNewStrategyFromModalOpen
