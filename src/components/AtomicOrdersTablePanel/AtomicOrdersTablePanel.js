import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import AtomicOrdersTable from '../AtomicOrdersTable'
import Panel from '../../ui/Panel'

const AtomicOrdersTablePanel = ({
  dark,
  onRemove,
  updateState,
  savedState,
}) => {
  const { t } = useTranslation()

  return (
    <Panel
      label={t('atomicOrdersTableModal.title')}
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
    >
      <AtomicOrdersTable
        tableState={savedState}
        updateTableState={updateState}
      />
    </Panel>
  )
}

AtomicOrdersTablePanel.propTypes = {
  onRemove: PropTypes.func.isRequired,
  dark: PropTypes.bool,
  // eslint-disable-next-line react/forbid-prop-types
  savedState: PropTypes.object.isRequired,
  updateState: PropTypes.func.isRequired,
}

AtomicOrdersTablePanel.defaultProps = {
  dark: true,
}

export default memo(AtomicOrdersTablePanel)
