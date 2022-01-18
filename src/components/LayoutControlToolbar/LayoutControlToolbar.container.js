import { connect } from 'react-redux'

import { createLayout, saveLayout, deleteLayout } from '../../redux/actions/ui'
import { getLayouts } from '../../redux/selectors/ui'

import LayoutControlToolbar from './LayoutControlToolbar'

const mapStateToProps = (state = {}) => ({
  layouts: getLayouts(state),
})

const mapDispatchToProps = {
  createLayout,
  saveLayout,
  deleteLayout,
}

export default connect(mapStateToProps, mapDispatchToProps)(LayoutControlToolbar)
