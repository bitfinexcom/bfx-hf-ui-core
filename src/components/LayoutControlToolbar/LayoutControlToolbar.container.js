import { connect } from 'react-redux'

import UIActions from '../../redux/actions/ui'
import { getLayouts } from '../../redux/selectors/ui'

import LayoutControlToolbar from './LayoutControlToolbar'

const mapStateToProps = (state = {}) => ({
  layouts: getLayouts(state),
})

const mapDispatchToProps = {
  saveLayout: UIActions.saveLayout,

  createLayout: UIActions.createLayout,

  deleteLayout: UIActions.deleteLayout,
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutControlToolbar)
