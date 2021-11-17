import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getIsFeedbackModalVisible } from '../../redux/selectors/ui'

import FeedbackModal from './FeedbackModal'

const mapStateToProps = (state = {}) => ({
  visible: getIsFeedbackModalVisible(state),
})

const mapDispatchToProps = dispatch => ({
  changeFeedbackVisibility: (visible) => dispatch(UIActions.changeFeedbackVisibilityState(visible)),
  submitFeedback: (reason, message) => {
    // TODO
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(FeedbackModal)
