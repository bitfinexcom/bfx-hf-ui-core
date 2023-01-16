import React, { lazy, memo } from 'react'
import PropTypes from 'prop-types'
import AppSettingsModal from '../AppSettingsModal'
import CloseSessionModal from '../CloseSessionModal'

// const BadConnectionModal = lazy(() => import('../BadConnectionModal'))
// const NoConnectionActionModal = lazy(() => import('../NoConnectionActionModal'))
// const OldFormatModal = lazy(() => import('../OldFormatModal'))
// const AOPauseModal = lazy(() => import('../AOPauseModal'))
// const CcyInfoModal = lazy(() => import('../CcyInfoModal'))
// const ClosePositionModal = lazy(() => import('../ClosePositionModal'))
// const ConfirmDMSModal = lazy(() => import('../ConfirmDMSModal'))
// const EditOrderModal = lazy(() => import('../EditOrderModal'))
// const ResetAPIKeysModal = lazy(() => import('../ResetAPIKeysModal'))
import BadConnectionModal from '../BadConnectionModal'
import NoConnectionActionModal from '../NoConnectionActionModal'
import OldFormatModal from '../OldFormatModal'
import AOPauseModal from '../AOPauseModal'
import CcyInfoModal from '../CcyInfoModal'
import ClosePositionModal from '../ClosePositionModal'
import ConfirmDMSModal from '../ConfirmDMSModal'
import EditOrderModal from '../EditOrderModal'
import ResetAPIKeysModal from '../ResetAPIKeysModal'

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
          <ResetAPIKeysModal />
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
