import React, {
  useState, memo,
} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cx from 'classnames'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import _isEmpty from 'lodash/isEmpty'
import _isNull from 'lodash/isNull'
import _find from 'lodash/find'

import OutsideClickHandler from 'react-outside-click-handler'
import { removeAlgoOrderParams, saveAlgoOrderParams, setActiveAOParamsID } from '../../redux/actions/ao'
import { getActiveAOparamsID, getAOParams } from '../../redux/selectors/ao'

import { ReactComponent as LayoutIcon } from '../Navbar/layout-icon.svg'
import NavbarButton from '../Navbar/Navbar.Button'

import AddNewParam from './Modals/AddNewParam'
import { makeShorterLongName } from '../../util/ui'
import { getIsAddNewParamModalVisible } from '../../redux/selectors/ui'
import { changeAddNewParamModalState } from '../../redux/actions/ui'

const MAX_NAME_LENGTH = 30

// since percentage values are stored as a floating variable [0, 1], they must be multiplied by 100 before they can be applied
const percentageParams = ['amountDistortion', 'intervalDistortion', 'sliceAmountPerc']

const Item = ({
  isSelected, isDisabled, children, ...props // eslint-disable-line
}) => (
  <div
    className={cx('hfui-orderform__ao-settings__item is-layout', {
      'is-selected': isSelected,
      'is-disabled': isDisabled,
    })}
    {...props}
  >
    {children}
  </div>
)

const AlgoParams = ({
  algoID, symbol, processAOData, setFieldData, validateAOData, updateValidationErrors,
}) => {
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(false)

  const activeAOID = useSelector(getActiveAOparamsID)
  const aoParams = useSelector(getAOParams)
  const isAddNewParamModalOpen = useSelector(getIsAddNewParamModalVisible)

  const selectedAOParams = aoParams[symbol]?.[algoID]

  const onSave = () => {
    if (!_isNull(activeAOID)) {
      const { name, id } = _find(selectedAOParams, (p) => p?.id === activeAOID)
      const params = processAOData()
      const errors = validateAOData(params)

      if (!_isEmpty(errors)) {
        updateValidationErrors(errors)
        return
      }

      const payload = {
        name, algoID, symbol, params, id,
      }

      dispatch(saveAlgoOrderParams(payload))
    }
  }

  const onDelete = (id) => {
    dispatch(setActiveAOParamsID(null))
    dispatch(removeAlgoOrderParams(algoID, symbol, id))
  }

  const onSelect = (selectedParams) => {
    const { id, params } = selectedParams
    const updatedParams = { ...params }

    for (let i = 0; i < percentageParams.length; ++i) {
      if (percentageParams[i] in updatedParams) {
        updatedParams[percentageParams[i]] *= 100
      }
    }

    dispatch(setActiveAOParamsID(id))
    setFieldData(updatedParams)
  }

  const openAddNewParamModal = () => dispatch(changeAddNewParamModalState(true))

  const closeAddNewParamModal = () => dispatch(changeAddNewParamModalState(false))

  return (
    <div className='hfui-orderform__ao-settings'>
      <NavbarButton
        icon={LayoutIcon}
        alt='AO Params settings'
        onClick={() => setIsOpen(true)}
        className={isOpen ? 'is-open' : undefined}
      />
      {isOpen && (
        <OutsideClickHandler onOutsideClick={() => setIsOpen(false)}>
          <div className='hfui-orderform__ao-settings__menu'>
            <div className='hfui-orderform__ao-settings__title'>
              Algo Params settings
            </div>
            <div className='hfui-orderform__ao-settings__menu-buttons' onClick={() => setIsOpen(false)}>
              <Item onClick={onSave} isDisabled={_isNull(activeAOID)}>
                Save
              </Item>
              <Item onClick={openAddNewParamModal}>
                Save As...
              </Item>
              {!_isEmpty(selectedAOParams) && (
                <>
                  <div className='hfui-orderform__ao-settings__separator' />
                  {_map(selectedAOParams, (params) => (
                    <Item
                      key={params?.id || params?.name}
                      isSelected={params?.id === activeAOID}
                      onClick={() => onSelect(params)}
                    >
                      {makeShorterLongName(params.name, MAX_NAME_LENGTH)}
                      {!_isEmpty(params?.id) && (
                        <div className='hfui-orderform__ao-settings__delete'>
                          <i className='icon-clear' role='button' aria-label='Delete Algo parameters' tabIndex={0} onClick={() => onDelete(params.id)} />
                        </div>
                      )}
                    </Item>
                  ))}
                </>
              )}
            </div>
          </div>
        </OutsideClickHandler>
      )}
      <AddNewParam
        isOpen={isAddNewParamModalOpen}
        onClose={closeAddNewParamModal}
        algoID={algoID}
        symbol={symbol}
        processAOData={processAOData}
        validateAOData={validateAOData}
      />
    </div>
  )
}

AlgoParams.propTypes = {
  algoID: PropTypes.string.isRequired,
  symbol: PropTypes.string.isRequired,
  processAOData: PropTypes.func.isRequired,
  setFieldData: PropTypes.func.isRequired,
  validateAOData: PropTypes.func.isRequired,
  updateValidationErrors: PropTypes.func.isRequired,
}

export default memo(AlgoParams)
