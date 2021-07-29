import React, { memo } from 'react'
import PropTypes from 'prop-types'

import AlgoOrdersTable from '../AlgoOrdersTable'
import Panel from '../../ui/Panel'

const AlgoOrdersTablePanel = ({ dark, onRemove }) => {
  return (
    <Panel
      label='Algo. Orders'
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
    >
      <AlgoOrdersTable />
    </Panel>
  )
}

AlgoOrdersTablePanel.propTypes = {
  dark: PropTypes.bool,
  onRemove: PropTypes.func.isRequired,
}

AlgoOrdersTablePanel.defaultProps = {
  dark: true,
}

export default memo(AlgoOrdersTablePanel)
