import React, { lazy, memo } from 'react'
import PropTypes from 'prop-types'
import AppSettingsModal from '../AppSettingsModal'
import CloseSessionModal from '../CloseSessionModal'
import DMSRemovalDisclaimerModal from '../DMSRemovalDisclaimerModal'
import LongTermClosedSessionModal from '../LongTermClosedSessionModal/LongTermClosedSessionModal'

const NoConnectionActionModal = lazy(() => import('../NoConnectionActionModal'))
const OldFormatModal = lazy(() => import('../OldFormatModal'))
const AOPauseModal = lazy(() => import('../AOPauseModal'))
const CcyInfoModal = lazy(() => import('../CcyInfoModal'))
const ClosePositionModal = lazy(() => import('../ClosePositionModal'))
const EditOrderModal = lazy(() => import('../EditOrderModal'))
const ResetAPIKeysModal = lazy(() => import('../ResetAPIKeysModal'))

const ModalsWrapper = ({ isElectronApp }) => {
  return (
    <>
      {isElectronApp && (
        <>
          <OldFormatModal />
          <AOPauseModal />
          <AppSettingsModal />
          <CloseSessionModal />
          <ResetAPIKeysModal />
        </>
      )}
      <NoConnectionActionModal />
      <LongTermClosedSessionModal />
      <CcyInfoModal />
      <EditOrderModal />
      <ClosePositionModal />
      <DMSRemovalDisclaimerModal />
    </>
  )
}

ModalsWrapper.propTypes = {
  isElectronApp: PropTypes.bool.isRequired,
}

export default memo(ModalsWrapper)
