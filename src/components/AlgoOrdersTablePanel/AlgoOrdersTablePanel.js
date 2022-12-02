import React, { memo } from 'react'
import PropTypes from 'prop-types'
import _toUpper from 'lodash/toUpper'
import { useTranslation } from 'react-i18next'
import Icon from 'react-fa'

import { useDispatch, useSelector } from 'react-redux'
import AlgoOrdersTable from '../AlgoOrdersTable'
import Panel from '../../ui/Panel'
import PanelButton from '../../ui/Panel/Panel.Button'
import { getShowAOsHistory } from '../../redux/selectors/ao'
import AOActions from '../../redux/actions/ao'

const AlgoOrdersTablePanel = ({ dark, onRemove }) => {
  const { t } = useTranslation()

  const isHistoryActive = useSelector(getShowAOsHistory)

  const dispatch = useDispatch()
  const toggleShowHistory = () => dispatch(AOActions.setShowAOsHistory(!isHistoryActive))

  return (
    <Panel
      label={t('AOTableModal.title')}
      onRemove={onRemove}
      dark={dark}
      darkHeader={dark}
      extraIcons={(
        <PanelButton
          onClick={toggleShowHistory}
          text={_toUpper(t('tradingStatePanel.history'))}
          isActive={isHistoryActive}
          icon={<Icon name='history' className='history-icon' />}
        />
)}
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
