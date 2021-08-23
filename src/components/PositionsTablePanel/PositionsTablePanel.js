import React, { memo } from 'react'
import PropTypes from 'prop-types'

import PositionsTable from '../PositionsTable'
import Panel from '../../ui/Panel'

const PositionsTablePanel = ({ onRemove, dark }) => (
  <Panel
    label='Positions'
    onRemove={onRemove}
    dark={dark}
    darkHeader={dark}
  >
    <PositionsTable />
  </Panel>
)

PositionsTablePanel.propTypes = {
  onRemove: PropTypes.func.isRequired,
  dark: PropTypes.bool,
}

PositionsTablePanel.defaultProps = {
  dark: true,
}

export default memo(PositionsTablePanel)
