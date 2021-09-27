import React from 'react'

import OrderFormModal from '../../OrderFormModal'

const ConnectingModal = () => (
  <OrderFormModal
    title='CONNECTING'
    icon='icon-api'
    content={(
      <span>
        Please wait while connecting to the API server..
      </span>
    )}
  />
)

export default ConnectingModal
