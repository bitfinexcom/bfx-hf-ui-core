import { connect } from 'react-redux'

import { getNotifications } from '../../redux/selectors/ws'
import NotificationsSidebar from './NotificationsSidebar'
import { changeUIModalState, removeNotifications, clearNotifications } from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'

const mapStateToProps = (state = {}) => ({
  notifications: getNotifications(state),
})

const mapDispatchToProps = dispatch => ({
  closeNotificationPanel: () => dispatch(changeUIModalState(UI_MODAL_KEYS.NOTIFICATIONS_PANEL, false)),
  removeNotifications: (cids) => dispatch(removeNotifications(cids)),
  clearNotifications: () => dispatch(clearNotifications()),
})

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsSidebar)
