import React, {
  memo, useState, useEffect, useCallback,
} from 'react'
import { Notifications, useInterval } from '@ufx-ui/core'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import _filter from 'lodash/filter'
import { withTranslation } from 'react-i18next'

import SidebarContent from './SidebarContent'
import './style.css'

const REFRESH_NOTIFICATIONS_MS = 1000
const LIVE_NOTIFICATIONS_MS = 5000

const EMPTY_ARR = []

const NotificationsSidebar = ({
  notifications, notificationsVisible, closeNotificationPanel, removeNotifications, clearNotifications, t,
}) => {
  const [newNotifications, setNewNotifications] = useState(EMPTY_ARR)
  const [visible, setVisible] = useState(notificationsVisible)

  const onClearNotifications = useCallback(() => {
    clearNotifications()

    setNewNotifications([])
  }, [clearNotifications])

  const checkNotificationsTime = () => {
    const nextNotifications = _filter(notifications, n => n?.mts > new Date().getTime() - LIVE_NOTIFICATIONS_MS)

    setNewNotifications(nextNotifications)
  }

  useEffect(() => {
    if (notificationsVisible) {
      setVisible(true)
    } else {
      setTimeout(() => setVisible(false), 700)
    }
  }, [notificationsVisible])

  // set notification on component mount
  useEffect(() => {
    setNewNotifications(notifications)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // get notifications prop update with delay
  useInterval(() => checkNotificationsTime(), REFRESH_NOTIFICATIONS_MS)

  return (
    <>
      <div
        className={ClassNames('hfui-notificationssidebar__background', {
          visible: notificationsVisible,
          hidden: !notificationsVisible,
        })}
        onClick={closeNotificationPanel}
      />
      <div className={ClassNames('hfui-notificationssidebar__wrapper', {
        visible: notificationsVisible,
        hidden: !notificationsVisible,
      })}
      >
        <SidebarContent
          closeNotificationPanel={closeNotificationPanel}
          notifications={notifications}
          notificationsVisible={visible}
          removeNotifications={removeNotifications}
          onClearNotifications={onClearNotifications}
          t={t}
        />

      </div>
      <Notifications className='hfui-notificationssidebar__external' notifications={newNotifications} />
    </>
  )
}

NotificationsSidebar.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeNotifications: PropTypes.func.isRequired,
  clearNotifications: PropTypes.func.isRequired,
  closeNotificationPanel: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  notificationsVisible: PropTypes.bool,
}

NotificationsSidebar.defaultProps = {
  notificationsVisible: false,
}

export default withTranslation()(memo(NotificationsSidebar))
