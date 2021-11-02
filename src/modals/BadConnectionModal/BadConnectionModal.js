import React, {
  memo, useState, useEffect, useRef,
} from 'react'
import { Checkbox } from '@ufx-ui/core'
import PropTypes from 'prop-types'

import { useTranslation } from 'react-i18next'
import Modal from '../../ui/Modal'

import './style.css'

const REBOOT_AFTER = 25

const BadConnection = ({
  changeBadInternetConnectionState, visible, rebootAutomatically, updateReboot, rebootnNotify,
}) => {
  const [countdown, setCountdown] = useState(REBOOT_AFTER)
  const countdownRef = useRef()
  countdownRef.current = countdown

  const onClose = () => {
    changeBadInternetConnectionState(false)
  }

  const onSubmit = () => {
    location.replace('/index.html') // eslint-disable-line
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

  const { t } = useTranslation()

  // reboot without showing prompt if connection issue and rebootAutomatically is true
  const reboot = rebootAutomatically && visible
  useEffect(() => {
    if (reboot) {
      rebootnNotify(t('notifications.reboot_notify'))
      // timeout to give user time to see above notification
      setTimeout(() => {
        onSubmit()
      }, 4000)
    }
  }, [reboot, rebootnNotify, t])

  if (reboot) {
    return ''
  }

  return (
    <Modal
      label={t('badConnectionModal.title')}
      className='hfui-bad-conn-modal__wrapper'
      isOpen={visible}
      onClose={onClose}
      onSubmit={onSubmit}
    >
      <p>{t('badConnectionModal.text1')}</p>
      <p>{t('badConnectionModal.text2')}</p>
      <p>{t('badConnectionModal.text3')}</p>
      <br />
      <p>
        {t('badConnectionModal.text4', { countdown })}
      </p>
      <Modal.Footer>
        <Checkbox
          label={t('badConnectionModal.checkbox')}
          checked={rebootAutomatically}
          onChange={updateReboot}
        />
        <Modal.Button onClick={onSubmit} primary>
          {t('ui.ok')}
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
  rebootnNotify: PropTypes.func.isRequired,
}

export default memo(BadConnection)
