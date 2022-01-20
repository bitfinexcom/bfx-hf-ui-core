import React, {
  memo, useState, useEffect, useCallback,
} from 'react'
import { Notifications, useInterval } from '@ufx-ui/core'
import ClassNames from 'clsx'
import PropTypes from 'prop-types'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import _filter from 'lodash/filter'
import { withTranslation } from 'react-i18next'

import Panel from '../../ui/Panel'
import Button from '../../ui/Button'
import Scrollbars from '../../ui/Scrollbars'
import './style.css'

const REFRESH_NOTIFICATIONS_MS = 1000
const LIVE_NOTIFICATIONS_MS = 5000

const NotificationsSidebar = ({
  notifications, notificationsVisible, closeNotificationPanel, removeNotifications, clearNotifications, t,
}) => {
  const [newNotifications, setNewNotifications] = useState([])

  const onClose = useCallback(({ cid, group }) => {
    let cids = []

    if (!_isEmpty(group)) {
      cids = _map(group, el => el.cid)
    } else if (!_isEmpty(cid)) {
      cids = [cid]
    }

    removeNotifications(cids)
  },
  [removeNotifications])

  const onClearNotifications = () => {
    clearNotifications()

    setNewNotifications([])
  }

  const checkNotificationsTime = () => {
    const nextNotifications = _filter(notifications, n => n?.mts > new Date().getTime() - LIVE_NOTIFICATIONS_MS)

    setNewNotifications(nextNotifications)
  }

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
        <Panel
          label={t('notifications.title')}
          hideIcons
          closePanel={closeNotificationPanel}
          preHeaderComponents={[
            <Button
              onClick={onClearNotifications}
              key='clear-btn'
              disabled={_isEmpty(notifications)}
              className='hfui-notificationssidebar__header-btn'
              label={[
                <i key='icon' className='icon-clear' />,
                <p key='text'>{t('notifications.clearAllBtn')}</p>,
              ]}
            />,
          ]}
        >
          {_isEmpty(notifications) ? (
            <p className='hfui-notificationssidebar__empty'>{t('notifications.noNotifications')}</p>
          ) : (
            <Scrollbars>
              <Notifications
                className='hfui-sidebar-notifications'
                notifications={notifications}
                onClose={onClose}
              />
            </Scrollbars>
          )}
        </Panel>
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
