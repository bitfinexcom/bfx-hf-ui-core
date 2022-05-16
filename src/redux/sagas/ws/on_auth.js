import { put } from 'redux-saga/effects'
import WSActions from '../../actions/ws'

export default function* ({ payload }) {
  if (window.pendo?.initialize) {
    window.pendo.initialize({
      visitor: {
        id: '44444visitor', // Required if user is logged in
        // email:        // Recommended if using Pendo Feedback, or NPS Email
        // full_name:    // Recommended if using Pendo Feedback
        // role:         // Optional

      // You can add any additional visitor level key-values here,
      // as long as it's not one of the above reserved names.
      },

      account: {
        id: '44444account', // Required if using Pendo Feedback
        // name:         // Optional
        // is_paying:    // Recommended if using Pendo Feedback
        // monthly_value:// Recommended if using Pendo Feedback
        // planLevel:    // Optional
        // planPrice:    // Optional
        // creationDate: // Optional

      // You can add any additional account level key-values here,
      // as long as it's not one of the above reserved names.
      },
    })
  }

  yield put(WSActions.recvAuthToken(payload))
}
