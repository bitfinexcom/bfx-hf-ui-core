import React from 'react'
import { Icon } from 'react-fa'
import _isEqual from 'lodash/isEqual'
import _isEmpty from 'lodash/isEmpty'
import _isString from 'lodash/isString'
import _isBoolean from 'lodash/isBoolean'
import _map from 'lodash/map'
import _find from 'lodash/find'
import _forEach from 'lodash/forEach'
import _trim from 'lodash/trim'
import _isArray from 'lodash/isArray'
import _isNil from 'lodash/isNil'
import PropTypes from 'prop-types'

import { isElectronApp } from '../../redux/config'
import Panel from '../../ui/Panel'
import { getIsAnyModalOpen } from '../../util/document'

import AOParamSettings from './Orderform.AlgoParams'
import ConnectingModal from './Modals/ConnectingModal'
import UnconfiguredModal from './Modals/UnconfiguredModal'
import SubmitAPIKeysModal from './Modals/SubmitAPIKeysModal'
import OrderFormMenu from './OrderFormMenu'
import { getAOs, getAtomicOrders } from './OrderForm.orders.helpers'
import {
  renderLayout, processFieldData, marketToQuoteBase, defaultDataForLayout, fixComponentContext,
  COMPONENTS_FOR_ID, validateAOData,
} from './OrderForm.helpers'

import './style.css'

const CONTEXT_LABELS = {
  e: 'orderForm.exchange',
  m: 'orderForm.margin',
  f: 'orderForm.derivatives',
}

class OrderForm extends React.Component {
  state = {
    fieldData: {},
    validationErrors: {},
    creationError: null,
    context: 'e',
    helpOpen: false,
    configureModalOpen: false,
    isAlgoOrder: false,
  }

  constructor(props) {
    super(props)

    const { savedState, activeMarket } = props
    const {
      currentMarket = activeMarket,
      marketDirty,
    } = savedState

    this.state = {
      ...this.state,
      currentMarket,
      marketDirty,
      fieldData: {},
      currentLayout: null,
      context: currentMarket.contexts[0],
    }

    this.onContextChange = this.onContextChange.bind(this)
    this.onFieldChange = this.onFieldChange.bind(this)
    this.onSubmit = this.onSubmit.bind(this)
    this.onToggleHelp = this.onToggleHelp.bind(this)
    this.onToggleConfigureModal = this.onToggleConfigureModal.bind(this)
    this.onSubmitAPIKeys = this.onSubmitAPIKeys.bind(this)
    this.onClearOrderLayout = this.onClearOrderLayout.bind(this)
    this.processAOData = this.processAOData.bind(this)
    this.setFieldData = this.setFieldData.bind(this)
    this.validateAOData = this.validateAOData.bind(this)
    this.handleKeydown = this.handleKeydown.bind(this)
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeydown)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !(_isEqual(nextProps, this.props)) || !(_isEqual(this.state, nextState))
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeydown)
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { activeMarket } = nextProps
    const {
      marketDirty, currentMarket, currentLayout, validationErrors,
    } = prevState

    // reset errors when switched back to orders list view
    const nextValidationErrors = _isNil(currentLayout?.label) ? {} : validationErrors

    if (marketDirty || (activeMarket === currentMarket)) {
      return {
        validationErrors: nextValidationErrors,
      }
    }

    return {
      currentMarket: activeMarket,
      context: activeMarket.contexts[0],
      fieldData: {},
      currentLayout: null,
      validationErrors: nextValidationErrors,
    }
  }

  handleKeydown(e) {
    // handle keys only when no modal is open, and it is orderform-details view
    if (getIsAnyModalOpen() || !this.getIsOrderFormInputsView()) {
      return
    }

    const { isAlgoOrder } = this.state
    const { key } = e
    if (key === 'Escape') {
      this.onClearOrderLayout()
    }
    if (key === 'Enter' && isAlgoOrder) {
      this.onSubmit('submit')
    }
  }

  onSubmitAPIKeys({ apiKey, apiSecret }) {
    const { submitAPIKeys, authToken, mode } = this.props
    submitAPIKeys({
      authToken,
      apiKey,
      apiSecret,
    }, mode)
  }

  onToggleHelp() {
    this.setState(({ helpOpen }) => ({
      helpOpen: !helpOpen,
    }))
  }

  onToggleConfigureModal() {
    this.setState(({ configureModalOpen }) => ({
      configureModalOpen: !configureModalOpen,
    }))
  }

  onContextChange(context) {
    this.setState(() => ({ context }))
  }

  onClearOrderLayout() {
    this.setState(() => ({
      currentLayout: null,
      fieldData: {},
    }))
  }

  onChangeActiveOrderLayout(orderLabel) {
    const {
      resetActiveAOParamsID, getAlgoOrderParams, aoParams, t,
    } = this.props
    const { currentMarket } = this.state
    const algoOrders = getAOs(t)
    const orders = getAtomicOrders(t)
    resetActiveAOParamsID()

    let uiDef = _find(orders, ({ label }) => label === orderLabel)
    const isAlgoOrder = !uiDef

    if (!uiDef) {
      uiDef = _find(algoOrders, ({ label }) => label === orderLabel)

      if (!_isArray(aoParams[currentMarket.wsID]?.[uiDef.id])) {
        getAlgoOrderParams(uiDef.id, currentMarket.wsID)
      }
    }
    uiDef.fields = fixComponentContext(uiDef.fields, currentMarket)

    this.setState(() => ({
      currentLayout: uiDef,
      fieldData: defaultDataForLayout(uiDef),
      isAlgoOrder,
    }))
  }

  onFieldChange(fieldName, value) {
    const { t } = this.props

    this.setState(({
      fieldData,
      currentLayout,
      validationErrors,
    }) => {
      const { fields = {} } = currentLayout
      const field = fields[fieldName] || {}
      const { disabled } = field

      if (_isBoolean(disabled) && disabled) {
        return null
      }

      const { component } = field
      const C = COMPONENTS_FOR_ID[component]
      let processedValue = value

      if (_isString(value)) {
        processedValue = _trim(value)
      }

      const validationError = (C && C.validateValue)
        ? C.validateValue(processedValue, t)
        : null

      return {
        creationError: null,

        fieldData: {
          ...fieldData,
          [fieldName]: processedValue,
        },

        validationErrors: {
          ...validationErrors,
          [fieldName]: validationError,
        },
      }
    })
  }

  onSubmit(action) {
    const { setIsOrderExecuting, isOrderExecuting } = this.props
    if (isOrderExecuting) {
      return
    }
    setIsOrderExecuting(true)

    if (action === 'submit') {
      this.onSubmitAlgoOrder()
      return
    } if (action === 'preview') {
      // TODO:
      return
    }

    const {
      currentLayout, fieldData, context, currentMarket,
    } = this.state

    const { submitOrder, authToken, gaSubmitOrder } = this.props
    const { generateOrder } = currentLayout
    const data = processFieldData({
      layout: currentLayout,
      fieldData,
      action,
    })

    try {
      const packet = generateOrder(data, currentMarket.wsID, context)
      submitOrder({
        authToken,
        packet,
      })
      gaSubmitOrder()
    } catch (e) {
      setIsOrderExecuting(false)
      this.setState(() => ({ creationError: e.message }))
    }
  }

  onSubmitAlgoOrder() {
    const {
      submitAlgoOrder, authToken, gaSubmitAO, setIsOrderExecuting, t,
    } = this.props
    const {
      currentMarket, currentLayout, fieldData, context,
    } = this.state

    const { id } = currentLayout
    const data = processFieldData({
      layout: currentLayout,
      action: 'submit',
      fieldData,
    })
    const errors = this.validateAOData(data)

    if (_isEmpty(errors)) {
      gaSubmitAO()
      submitAlgoOrder({
        id,
        data,
        context,
        authToken,
        market: currentMarket,
      })
    } else {
      setIsOrderExecuting(false)
      const { field, message, i18n } = errors
      this.setState(({ validationErrors }) => ({
        validationErrors: {
          ...validationErrors,
          [field]: i18n ? t(`algoOrderForm.validationMessages.${i18n.key}`, i18n.props) : message,
        },
      }))
    }
  }

  getIsOrderFormInputsView() {
    const { apiClientState, apiCredentials } = this.props
    const { currentLayout, helpOpen } = this.state

    const apiClientConnected = apiClientState === 2
    const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid
    const isConnectedWithValidAPI = apiClientConnected && apiClientConfigured
    const showOrderform = isConnectedWithValidAPI || !isElectronApp

    const isOrderFormInputsView = !helpOpen && currentLayout && showOrderform

    return isOrderFormInputsView
  }

  setFieldData(data) {
    this.setState({
      fieldData: data,
    })
  }

  updateValidationErrors(errors) {
    const { field, message } = errors
    this.setState(({ validationErrors }) => ({
      validationErrors: {
        ...validationErrors,
        [field]: message,
      },
    }))
  }

  validateAOData(data) {
    const { currentLayout, currentMarket } = this.state
    const { atomicOrdersCount, atomicOrdersCountActiveMarket, maxOrderCounts } = this.props

    return validateAOData(data, currentLayout, currentMarket, atomicOrdersCount, atomicOrdersCountActiveMarket, maxOrderCounts)
  }

  processAOData() {
    const { currentLayout, fieldData } = this.state

    return processFieldData({
      layout: currentLayout,
      action: 'submit',
      fieldData,
    })
  }

  deferSaveState() {
    setTimeout(() => {
      this.saveState()
    }, 0)
  }

  saveState() {
    const { saveState, layoutI } = this.props
    const { currentMarket, marketDirty } = this.state

    saveState(layoutI, {
      currentMarket,
      marketDirty,
    })
  }

  render() {
    const {
      onRemove, apiClientState, apiCredentials, moveable, removeable, isPaperTrading, isOrderExecuting, activeMarket, t,
    } = this.props
    const orders = getAtomicOrders(t)

    const {
      fieldData, validationErrors, creationError, context, currentLayout,
      helpOpen, configureModalOpen, currentMarket,
    } = this.state

    const algoOrders = getAOs(t)

    const apiClientConnected = apiClientState === 2
    const apiClientConnecting = apiClientState === 1
    const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid
    const isConnectedWithValidAPI = apiClientConnected && apiClientConfigured
    const showOrderform = isConnectedWithValidAPI || !isElectronApp
    const renderData = marketToQuoteBase(currentMarket)
    const atomicOrderTypes = []
    const algoOrderTypes = []

    _forEach(orders, ({ label, id, uiIcon }) => atomicOrderTypes.push({
      id,
      label,
      uiIcon,
    }))

    _forEach(algoOrders, ({ label, id, uiIcon }) => {
      algoOrderTypes.push({
        id,
        label,
        uiIcon,
      })
    })

    return (
      <>
        <Panel
          key='execute-order'
          darkHeader
          dark
          label={t('orderForm.title')}
          className='hfui-orderform__panel'
          moveable={moveable}
          removeable={removeable}
          onRemove={onRemove}
          extraIcons={[
            !helpOpen && currentLayout && currentLayout.customHelp && (
              <Icon
                key='question'
                name='question'
                onClick={this.onToggleHelp}
              />
            ),
            !helpOpen && currentLayout && currentLayout.id && (
              <AOParamSettings
                key='ao-settings'
                algoID={currentLayout.id}
                context={context}
                symbol={activeMarket.wsID}
                processAOData={this.processAOData}
                setFieldData={this.setFieldData}
                setContext={this.onContextChange}
                validateAOData={this.validateAOData}
                updateValidationErrors={this.updateValidationErrors}
              />
            ),
          ]}
        >
          <div key='orderform-wrapper' className='hfui-orderform__wrapper'>
            {isElectronApp && [
              apiClientConnecting && (
                <ConnectingModal key='connecting' />
              ),

              !apiClientConfigured && !configureModalOpen && (
                <UnconfiguredModal
                  key='unconfigured'
                  onClick={this.onToggleConfigureModal}
                  isPaperTrading={isPaperTrading}
                  keyExistButNotValid={apiCredentials?.configured && !apiCredentials?.valid}
                />
              ),

              !apiClientConfigured && configureModalOpen && (
                <SubmitAPIKeysModal
                  key='submit-api-keys'
                  onClose={this.onToggleConfigureModal}
                  onSubmit={this.onSubmitAPIKeys}
                  apiClientConnecting={apiClientConnecting}
                  isPaperTrading={isPaperTrading}
                />
              ),
            ]}

            {helpOpen && showOrderform && currentLayout && currentLayout.customHelp && (
              <div key='overlay-wrapper' className='hfui-orderform__overlay-wrapper'>
                <div className='hfui-orderform__help-inner'>
                  <p className='hfui-orderform__help-title'>
                    <span className='prefix'>{t('orderForm.help')}</span>
                    {currentLayout.label}
                    <i
                      role='button'
                      tabIndex={0}
                      onClick={this.onToggleHelp}
                      className='hfui-orderform__question-btn icon-cancel'
                    />
                  </p>
                  <p className='hfui-orderform__help-content'>
                    {currentLayout.customHelp}
                  </p>
                </div>
              </div>
            )}

            {!currentLayout && showOrderform && (
              <div key='order-form-menu' className='hfui-orderform__overlay-wrapper'>
                <OrderFormMenu
                  atomicOrderTypes={atomicOrderTypes}
                  algoOrderTypes={algoOrderTypes}
                  onSelect={({ label }) => this.onChangeActiveOrderLayout(label)}
                />
              </div>
            )}

            {this.getIsOrderFormInputsView() && [
              <div className='hfui-orderform__layout-label' key='layout-label'>
                <i
                  className='icon-back-arrow'
                  onClick={this.onClearOrderLayout}
                />
                <div className='hfui-orderform__layout-label-inner'>
                  <i className={`icon-${currentLayout.uiIcon}`} />
                  <p>{currentLayout.label}</p>
                </div>
              </div>,

              <ul className='hfui-orderform__header' key='of-header'>
                <li key='item' className='hfui-orderform__centered-item'>
                  {_map(currentMarket.contexts, value => (
                    <div key={value} onClick={() => this.onContextChange(value)} className={`hfui__orderform-tab ${value === context ? 'active' : ''}`}>
                      <p>{t(CONTEXT_LABELS[value])}</p>
                    </div>
                  ))}
                </li>
              </ul>,

              renderLayout({
                onSubmit: this.onSubmit,
                onFieldChange: this.onFieldChange,
                layout: currentLayout,
                validationErrors,
                renderData,
                isOrderExecuting,
                t,
                fieldData: {
                  ...fieldData,
                  _context: context,
                },
              }),

              creationError && (
                <div className='hfui-orderform__creation-error' key='of-error'>
                  <p>{creationError}</p>
                </div>
              ),
            ]}
          </div>
        </Panel>
      </>
    )
  }
}

OrderForm.propTypes = {
  savedState: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.string, PropTypes.bool, PropTypes.object,
  ])).isRequired,
  activeMarket: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ])).isRequired,
  apiClientState: PropTypes.number.isRequired,
  apiCredentials: PropTypes.objectOf(PropTypes.bool),
  setIsOrderExecuting: PropTypes.func.isRequired,
  mode: PropTypes.string.isRequired,
  submitAPIKeys: PropTypes.func.isRequired,
  getAlgoOrderParams: PropTypes.func.isRequired,
  aoParams: PropTypes.objectOf(PropTypes.object).isRequired,
  resetActiveAOParamsID: PropTypes.func.isRequired,
  submitOrder: PropTypes.func.isRequired,
  gaSubmitOrder: PropTypes.func.isRequired,
  submitAlgoOrder: PropTypes.func.isRequired,
  gaSubmitAO: PropTypes.func.isRequired,
  saveState: PropTypes.func.isRequired,
  isPaperTrading: PropTypes.bool.isRequired,
  layoutI: PropTypes.string,
  authToken: PropTypes.string,
  onRemove: PropTypes.func,
  isOrderExecuting: PropTypes.bool,
  moveable: PropTypes.bool,
  removeable: PropTypes.bool,
  t: PropTypes.func.isRequired,
  atomicOrdersCount: PropTypes.number.isRequired,
  atomicOrdersCountActiveMarket: PropTypes.number.isRequired,
  maxOrderCounts: PropTypes.objectOf(PropTypes.number).isRequired,
}

OrderForm.defaultProps = {
  moveable: true,
  removeable: true,
  isOrderExecuting: false,
  apiCredentials: {},
  onRemove: () => { },
  authToken: null,
  layoutI: 'orderform',
}

export default OrderForm
