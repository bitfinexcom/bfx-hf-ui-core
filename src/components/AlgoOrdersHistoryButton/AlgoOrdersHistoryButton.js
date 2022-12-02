import React from 'react'
import Icon from 'react-fa'
import _toUpper from 'lodash/toUpper'
import { useDispatch, useSelector } from 'react-redux'

import { useTranslation } from 'react-i18next'
import PanelButton from '../../ui/Panel/Panel.Button'
import { getShowAOsHistory } from '../../redux/selectors/ao'
import AOActions from '../../redux/actions/ao'

import './style.css'

const AlgoOrdersHistoryButton = () => {
  const { t } = useTranslation()

  const isHistoryActive = useSelector(getShowAOsHistory)

  const dispatch = useDispatch()
  const toggleShowHistory = () => dispatch(AOActions.setShowAOsHistory(!isHistoryActive))

  return (
    <PanelButton
      onClick={toggleShowHistory}
      text={_toUpper(t('tradingStatePanel.history'))}
      isActive={isHistoryActive}
      icon={<Icon name='history' className='hfui-history-button__icon' />}
    />
  )
}

export default AlgoOrdersHistoryButton
