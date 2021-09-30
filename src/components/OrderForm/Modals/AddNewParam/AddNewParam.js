import React, { useState, memo } from 'react'
import { useDispatch } from 'react-redux'
import _isEmpty from 'lodash/isEmpty'
import _size from 'lodash/size'
import PropTypes from 'prop-types'

import Input from '../../../../ui/Input'
import Modal from '../../../../ui/Modal'
import { saveAlgoOrderParams } from '../../../../redux/actions/ao'

const MAX_LABEL_LENGTH = 30

const AddNewParamModal = ({
  onClose, isOpen, algoID, symbol, processAOData, validateAOData,
}) => {
  const dispatch = useDispatch()
  const [name, setName] = useState('')
  const [error, setError] = useState('')

  const _onClose = () => {
    setError('')
    setName('')
    onClose()
  }

  const onSubmitHandler = () => {
    if (_isEmpty(name)) {
      setError('Label is empty')
      return
    }
    const labelSize = _size(name)

    if (labelSize > MAX_LABEL_LENGTH) {
      setError(`Label is too large (${labelSize}/${MAX_LABEL_LENGTH})`)
      return
    }

    const params = processAOData()
    const errors = validateAOData(params)
    if (!_isEmpty(errors)) {
      const { field, message } = errors
      setError(`AO Params Validation Error: ${field} - ${message}`)
      return
    }

    const payload = {
      name, algoID, symbol, params,
    }

    dispatch(saveAlgoOrderParams(payload))
    _onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={_onClose} label='Create Algo Order Template'>
      <Input
        type='text'
        placeholder='Template label'
        value={name}
        onChange={setName}
      />

      {!_isEmpty(error) && (
        <p className='error'>{error}</p>
      )}

      <Modal.Footer>
        <Modal.Button onClick={onSubmitHandler} primary>
          Save
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

AddNewParamModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  algoID: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  processAOData: PropTypes.func.isRequired,
  validateAOData: PropTypes.func.isRequired,
}

export default memo(AddNewParamModal)
