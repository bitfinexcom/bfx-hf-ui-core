import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import AlgoOrdersTable from '../AlgoOrdersTable'
import Panel from '../../ui/Panel'
import AlgoOrdersHistoryButton from '../AlgoOrdersHistoryButton'

const AlgoOrdersTablePanel = ({ dark, onRemove }) => {
  const { t } = useTranslation()

  return (
    <Panel
      label={t('AOTableModal.title')}
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
      extraIcons={<AlgoOrdersHistoryButton />}
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
