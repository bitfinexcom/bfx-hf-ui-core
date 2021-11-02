import React, {
  useRef, useState, memo, useEffect,
} from 'react'
import { useDispatch } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import _values from 'lodash/values'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import Modal from '../../../ui/Modal'
import Dropdown from '../../../ui/Dropdown'
import { addComponent } from '../../../redux/actions/ui'
import {
  COMPONENT_TYPES, COMPONENT_LABELS,
} from '../../../components/GridLayout/GridLayout.helpers'

import './style.css'

const AddLayoutComponentModal = ({ onClose, isOpen }) => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [componentType, setComponentType] = useState(COMPONENT_LABELS.CHART)

  const onSubmitHandler = () => {
    if (_isEmpty(componentType) || !COMPONENT_LABELS[componentType]) {
      setError(t('layoutSettings.invalidComponentError'))
      return
    }

    dispatch(addComponent(componentType))
    onClose()
  }

  const dropdownRef = useRef()

  useEffect(() => {
    if (isOpen && dropdownRef?.current) {
      dropdownRef.current.click()
    }
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className='hfui-addlayoutcomponentmodal__wrapper'
      label={t('layoutSettings.addComponent')}
      onSubmit={onSubmitHandler}
    >
      <Dropdown
        ref={dropdownRef}
        value={componentType}
        onChange={setComponentType}
        options={_map(_values(COMPONENT_TYPES), type => ({
          label: t(COMPONENT_LABELS[type]),
          value: type,
        }))}
        searchable
      />

      {!_isEmpty(error) && (
        <p className='error'>{error}</p>
      )}

      <Modal.Footer>
        <Modal.Button
          primary
          onClick={onSubmitHandler}
        >
          {t('layoutSettings.addComponent')}
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

AddLayoutComponentModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default memo(AddLayoutComponentModal)
