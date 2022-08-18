import React, { lazy, memo } from 'react'
import PropTypes from 'prop-types'
import AppSettingsModal from '../AppSettingsModal'
import CloseSessionModal from '../CloseSessionModal'

const BadConnectionModal = lazy(() => import('../BadConnectionModal'))
const NoConnectionActionModal = lazy(() => import('../NoConnectionActionModal'))
const OldFormatModal = lazy(() => import('../OldFormatModal'))
const AOPauseModal = lazy(() => import('../AOPauseModal'))
const CcyInfoModal = lazy(() => import('../CcyInfoModal'))
const ClosePositionModal = lazy(() => import('../ClosePositionModal'))
const ConfirmDMSModal = lazy(() => import('../ConfirmDMSModal'))
const EditOrderModal = lazy(() => import('../EditOrderModal'))

const ModalsWrapper = ({ isElectronApp }) => {
  return (
    <>
      {isElectronApp && (
      <>
        <OldFormatModal />
        <ConfirmDMSModal />
        <AOPauseModal />
        <AppSettingsModal />
        <CloseSessionModal />
      </>
      )}
      <NoConnectionActionModal />
      <BadConnectionModal />
      <CcyInfoModal />
      <EditOrderModal />
      <ClosePositionModal />
    </>
  )
}

ModalsWrapper.propTypes = {
  isElectronApp: PropTypes.bool.isRequired,
}

export default memo(ModalsWrapper)
