import React, { memo } from 'react'
import PropTypes from 'prop-types'
import AtomicOrdersTable from '../AtomicOrdersTable'
import Panel from '../../ui/Panel'

const AtomicOrdersTablePanel = ({ dark, onRemove }) => {
  return (
    <Panel
      label='Atomic Orders'
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
    >
      <AtomicOrdersTable />
    </Panel>
  )
}

AtomicOrdersTablePanel.propTypes = {
  onRemove: PropTypes.func,
  dark: PropTypes.bool,
}

AtomicOrdersTablePanel.defaultProps = {
  onRemove: () => {},
  dark: true,
}

export default memo(AtomicOrdersTablePanel)
