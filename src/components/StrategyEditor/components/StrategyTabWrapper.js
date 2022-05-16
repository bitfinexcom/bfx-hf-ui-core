import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import ConnectingModal from '../../APIKeysConfigurateForm/ConnectingModal'
import UnconfiguredModal from '../../APIKeysConfigurateForm/UnconfiguredModal'
import SubmitAPIKeysModal from '../../APIKeysConfigurateForm/SubmitAPIKeysModal'
import {
  getAPIClientState,
  getAuthToken,
  getCurrentModeAPIKeyState,
} from '../../../redux/selectors/ws'
import { getCurrentMode, getIsPaperTrading } from '../../../redux/selectors/ui'
import WSActions from '../../../redux/actions/ws'
import { getScope } from '../../../util/scope'

const StrategyTabWrapper = ({ children }) => {
  const [configureModalOpen, setConfigureModalOpen] = useState(false)
  const [isExecutionAllowed, setIsExecutionAllowed] = useState(true)

  const apiClientState = useSelector(getAPIClientState)
  const apiCredentials = useSelector(getCurrentModeAPIKeyState)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const mode = useSelector(getCurrentMode)
  const authToken = useSelector(getAuthToken)

  const apiClientConnecting = apiClientState === 1
  const apiClientConfigured = apiCredentials?.configured && apiCredentials?.valid

  const dispatch = useDispatch()

  const showConfigureModal = () => setConfigureModalOpen(true)
  const closeConfigureModal = () => setConfigureModalOpen(false)
  const onSubmitAPIKeys = ({ apiKey, apiSecret }) => {
    dispatch(WSActions.updatingApiKey(mode, true))
    dispatch(
      WSActions.send([
        'api_credentials.save',
        authToken,
        apiKey,
        apiSecret,
        mode,
        mode,
        getScope(),
      ]),
    )
  }
  useEffect(() => {
    setIsExecutionAllowed(apiClientConfigured)
  }, [setIsExecutionAllowed, apiClientConfigured])

  return (
    <div className='hfui-strategyeditor__wrapper'>
      {isExecutionAllowed ? (
        children
      ) : (
        <>
          {apiClientConnecting && <ConnectingModal key='connecting' />}
          {!apiClientConfigured && !configureModalOpen && (
            <UnconfiguredModal
              key='unconfigured'
              onClick={showConfigureModal}
              isPaperTrading={isPaperTrading}
              keyExistButNotValid={
                apiCredentials?.configured && !apiCredentials?.valid
              }
            />
          )}
          {!apiClientConfigured && configureModalOpen && (
            <SubmitAPIKeysModal
              key='submit-api-keys'
              onClose={closeConfigureModal}
              onSubmit={onSubmitAPIKeys}
              apiClientConnecting={apiClientConnecting}
              isPaperTrading={isPaperTrading}
            />
          )}
        </>
      )}
    </div>
  )
}

StrategyTabWrapper.propTypes = {
  children: PropTypes.node.isRequired,
}

export default StrategyTabWrapper
