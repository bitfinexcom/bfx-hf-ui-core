import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import AtomicOrdersTable from '../AtomicOrdersTable'
import Panel from '../../ui/Panel'

const AtomicOrdersTablePanel = ({ dark, onRemove }) => {
  const { t } = useTranslation()

  return (
    <Panel
      label={t('atomicOrdersTableModal.title')}
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
  onRemove: () => { },
  dark: true,
}

export default memo(AtomicOrdersTablePanel)
