import { connect } from 'react-redux'

import { getSortedByTimeStrategies } from '../../../redux/selectors/ws'
import OpenExistingStrategyModal from './OpenExistingStrategyModal'

const mapStateToProps = (state = {}) => ({
  strategies: getSortedByTimeStrategies(state),
})

export default connect(mapStateToProps)(OpenExistingStrategyModal)
