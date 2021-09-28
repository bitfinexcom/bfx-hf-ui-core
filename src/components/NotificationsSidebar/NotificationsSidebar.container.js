import { connect } from 'react-redux'

import { getNotifications } from '../../redux/selectors/ws'
import NotificationsSidebar from './NotificationsSidebar'
import { closeNotificationPanel, removeNotifications, clearNotifications } from '../../redux/actions/ui'

const mapStateToProps = (state = {}) => ({
  notifications: getNotifications(state),
})

const mapDispatchToProps = {
  closeNotificationPanel,
  removeNotifications,
  clearNotifications,
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsSidebar)
