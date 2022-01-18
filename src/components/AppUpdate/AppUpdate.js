import React, { useState } from 'react'
import PropTypes from 'prop-types'

import 'style.css'

function AppUpdate(props) {
  const [hidden, setHidden] = useState(true)
  const closeNotification = () => {
    notification.classList.add('hidden')
  }

  const restartApp = () => {
    ipcRenderer.send('restart_app')
  }

  return (
    <div id='hfui-app-update__notification' className='hidden'>
      <p id='message' />
      <div className='btn-group'>
        <button
          id='close-button'
          type='button'
          onClick={closeNotification}
        >
          Close
        </button>
        <button
          id='restart-button'
          type='button'
          onClick='restartApp()'
          className='hidden'
        >
          Restart
        </button>
      </div>
    </div>
  )
}

AppUpdate.propTypes = {

}

export default AppUpdate
