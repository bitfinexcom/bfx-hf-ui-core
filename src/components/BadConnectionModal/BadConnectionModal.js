import React, {
  memo, useState, useEffect, useRef,
} from 'react'
import { Checkbox } from '@ufx-ui/core'
import PropTypes from 'prop-types'

import Modal from '../../ui/Modal'
import './style.css'

const REBOOT_AFTER = 25

const BadConnection = ({
  changeBadInternetConnectionState, visible, rebootAutomatically, updateReboot,
}) => {
  const [isRebootChecked, setIsRebootChecked] = useState(rebootAutomatically)
  const [countdown, setCountdown] = useState(REBOOT_AFTER)
  const countdownRef = useRef()
  countdownRef.current = countdown

  const onClose = () => {
    changeBadInternetConnectionState(false)
  }

  const onSubmit = () => {
    location.replace('/index.html') // eslint-disable-line
  }

  const onRebootUpdate = (nextReboot) => {
    setIsRebootChecked(nextReboot)
    updateReboot(nextReboot)
  }

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (visible) {
        if (countdownRef.current > 1) {
          setCountdown(countdownRef.current - 1)
        } else {
          onSubmit()
        }
      } else {
        setCountdown(REBOOT_AFTER)
      }
    }, 1000)

    return () => clearInterval(intervalID)
  }, [visible])

  return (
    <Modal
      label='Connection issue'
      className='hfui-bad-conn-modal__wrapper'
      isOpen={visible}
      onClose={onClose}
    >
      <p>We&apos;ve noticed several internet connection issues. It&apos;s required to reboot the app to continue normal operation.</p>
      <p>Please make sure you have stable and good internet connection.</p>
      <p>The Honey Framework will reboot after you press &apos;Okay&apos;.</p>
      <br />
      <p>
        The app will reboot automatically in&nbsp;
        {countdown}
        &nbsp;seconds.
      </p>
      <Modal.Footer>
        <Checkbox
          label='Reboot automatically'
          checked={isRebootChecked}
          onChange={onRebootUpdate}
        />
        <Modal.Button onClick={onSubmit} primary>
          Okay
        </Modal.Button>
      </Modal.Footer>
    </Modal>
  )
}

BadConnection.propTypes = {
  changeBadInternetConnectionState: PropTypes.func.isRequired,
  visible: PropTypes.bool.isRequired,
  updateReboot: PropTypes.func.isRequired,
  rebootAutomatically: PropTypes.bool.isRequired,
}

export default memo(BadConnection)
