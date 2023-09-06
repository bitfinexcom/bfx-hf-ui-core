import React from 'react'
import _toUpper from 'lodash/toUpper'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { Spinner } from '@ufx-ui/core'
import PanelButton from '../Panel/Panel.Button'
import HistoryIcon from '../Icons/HistoryIcon'

import './style.css'

const HistoryButton = ({ onClick, isActive, isLoading }) => {
  const { t } = useTranslation()
  return (
    <PanelButton
      onClick={onClick}
      text={_toUpper(t('tradingStatePanel.history'))}
      isActive={isActive}
      icon={
        isLoading ? (
          <Spinner className='hfui-history-button__spinner' />
        ) : (
          <HistoryIcon width='25px' height='25px' />
        )
      }
    />
  )
}

HistoryButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
}

export default HistoryButton
