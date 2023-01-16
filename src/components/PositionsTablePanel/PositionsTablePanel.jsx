import React, { memo } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

import PositionsTable from '../PositionsTable'
import Panel from '../../ui/Panel'

const PositionsTablePanel = ({ onRemove, dark }) => {
  const { t } = useTranslation()

  return (
    <Panel
      label={t('positionsTableModal.title')}
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
    >
      <PositionsTable />
    </Panel>
  )
}

PositionsTablePanel.propTypes = {
  onRemove: PropTypes.func.isRequired,
  dark: PropTypes.bool,
}

PositionsTablePanel.defaultProps = {
  dark: true,
}

export default memo(PositionsTablePanel)
