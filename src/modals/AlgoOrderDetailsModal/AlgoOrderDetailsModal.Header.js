import React from 'react'
import PropTypes from 'prop-types'
import AlgoOrderActions from '../../components/AlgoOrdersTable/AlgoOrderActions'
import PanelIconButton from '../../ui/Panel/Panel.IconButton'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

const AlgoOrderDetailsModalHeader = ({ rowData, onClose }) => {
  return (
    <div className='title-container'>
      <div className='hfui-navbar__layout-settings__title'>
        {rowData?.name}
        <span className='sub-title'>{rowData?.alias}</span>
      </div>
      <div className='actions-container'>
        <AlgoOrderActions
          key={rowData?.gid}
          order={rowData}
          isInAlgoOrderDetailsModal
        />
        <PanelIconButton
          onClick={onClose}
          icon={<i className='icon-cancel' />}
        />
      </div>
    </div>
  )
}

AlgoOrderDetailsModalHeader.propTypes = {
  rowData: PropTypes.shape(ORDER_SHAPE),
  onClose: PropTypes.func.isRequired,
}

AlgoOrderDetailsModalHeader.defaultProps = {
  rowData: {},
}

export default AlgoOrderDetailsModalHeader
