import React, { useCallback, useMemo, memo } from 'react'
import { Notifications } from '@ufx-ui/core'
import _isEmpty from 'lodash/isEmpty'
import _map from 'lodash/map'
import PropTypes from 'prop-types'

import Panel from '../../ui/Panel'
import Button from '../../ui/Button'
import Scrollbars from '../../ui/Scrollbars'

function SidebarContent(props) {
  const {
    closeNotificationPanel,
    notifications,
    notificationsVisible,
    removeNotifications,
    onClearNotifications,
    t,
  } = props

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

  const panelHeader = useMemo(() => ([
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
  ]),
  [notifications, onClearNotifications, t])

  if (!notificationsVisible) {
    return null
  }

  return (
    <Panel
      label={t('notifications.title')}
      hideIcons
      closePanel={closeNotificationPanel}
      preHeaderComponents={panelHeader}
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
  )
}

SidebarContent.propTypes = {
  notifications: PropTypes.arrayOf(PropTypes.object).isRequired,
  removeNotifications: PropTypes.func.isRequired,
  closeNotificationPanel: PropTypes.func.isRequired,
  onClearNotifications: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  notificationsVisible: PropTypes.bool,
}

SidebarContent.defaultProps = {
  notificationsVisible: false,
}

export default memo(SidebarContent)
