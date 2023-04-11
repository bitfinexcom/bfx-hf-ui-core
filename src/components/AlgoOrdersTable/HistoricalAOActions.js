import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Debug from 'debug'
import { Tooltip } from '@ufx-ui/core'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Item } from '../Navbar/Navbar.LayoutSettings'
import UIActions from '../../redux/actions/ui'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'

const debug = Debug('hfui:c:algo-order-action')

const HistoricalAOActions = ({
  order,
}) => {
  const tooltipRef = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { gid } = order

  const deleteOrder = () => {
    debug('deleting historical algo order %d', gid)
    // TODO: Send delete request to server
  }

  const relaunchOrder = () => {
    dispatch(UIActions.setUIValue(UI_KEYS.orderToEdit, order))
    dispatch(
      UIActions.changeUIModalState(UI_MODAL_KEYS.RELAUNCH_ORDER_MODAL, true),
    )
    // when option selected and EditOrderModal appears, the Tooltip component should be hidden
    tooltipRef?.current?.hideTooltip?.()
  }

  return (
    <div className='hfui-ao-actions'>
      <Tooltip
        className='tooltip__edit-order-menu'
        ref={tooltipRef}
        trigger='click'
        content={(
          <div className='hfui-navbar__layout-settings__menu-buttons'>
            <Item onClick={relaunchOrder}>
              {t('ui.relaunch')}
            </Item>
            <Item onClick={deleteOrder}>
              {t('ui.deleteBtn')}
            </Item>
          </div>
        )}
      >
        <Icon
          className='more-options-button'
          name='ellipsis-v'
          aria-label='More options'
        />
      </Tooltip>
    </div>
  )
}

HistoricalAOActions.propTypes = {
  order: PropTypes.shape(ORDER_SHAPE).isRequired,
}

export default HistoricalAOActions
