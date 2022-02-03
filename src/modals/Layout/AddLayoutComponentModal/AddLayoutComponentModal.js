import React, {
  useRef, useState, memo, useEffect, useMemo,
  useCallback,
} from 'react'
import { useDispatch } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import _values from 'lodash/values'
import _map from 'lodash/map'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router'

import Modal from '../../../ui/Modal'
import Dropdown from '../../../ui/Dropdown'
import { addComponent } from '../../../redux/actions/ui'
import {
  COMPONENT_TYPES,
  COMPONENT_LABELS,
  COMPONENT_TYPES_MARKET_DATA,
} from '../../../components/GridLayout/GridLayout.helpers'
import { marketData } from '../../../constants/routes'

import './style.css'

const AddLayoutComponentModal = ({ onClose, isOpen }) => {
  const { t } = useTranslation()

  const [error, setError] = useState('')
  const [componentType, setComponentType] = useState(COMPONENT_LABELS.CHART)

  const dispatch = useDispatch()

  const onSubmitHandler = useCallback(() => {
    if (_isEmpty(componentType) || !COMPONENT_LABELS[componentType]) {
      setError(t('layoutSettings.invalidComponentError'))
      return
    }

    dispatch(addComponent(componentType))
    onClose()
  }, [componentType, dispatch, onClose, t])

  const location = useLocation()
  const dropdownOptions = useMemo(() => {
    const componentsArray = _values(
      location.pathname === marketData.path
        ? COMPONENT_TYPES_MARKET_DATA
        : COMPONENT_TYPES,
    )

    return _map(componentsArray, (type) => ({
      label: t(COMPONENT_LABELS[type]),
      value: type,
    }))
  }, [location, t])

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
        options={dropdownOptions}
        searchable
      />

      {!_isEmpty(error) && <p className='error'>{error}</p>}

      <Modal.Footer>
        <Modal.Button primary onClick={onSubmitHandler}>
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
