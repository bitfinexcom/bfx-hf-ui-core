import { connect } from 'react-redux'
import { v4 } from 'uuid'

import UIActions from '../../redux/actions/ui'
import WSActions from '../../redux/actions/ws'
import { getIsFeedbackModalVisible } from '../../redux/selectors/ui'

import FeedbackModal from './FeedbackModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsFeedbackModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  changeFeedbackVisibility: (visible) => dispatch(UIActions.changeFeedbackVisibilityState(visible)),
  submitFeedback: (reason, message, t) => {
    // TODO: submit feedback
    dispatch(WSActions.recvNotification({
      mts: Date.now(),
      status: 'success',
      text: t('feedbackModal.successNotification'),
      cid: v4(),
    }))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal)
