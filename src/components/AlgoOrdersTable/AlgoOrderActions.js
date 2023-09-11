import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import Debug from 'debug'
import { Tooltip } from '@ufx-ui/core'
import { Icon } from 'react-fa'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'

import { Item } from '../Navbar/Navbar.LayoutSettings'
import WSActions from '../../redux/actions/ws'
import UIActions from '../../redux/actions/ui'
import GAActions from '../../redux/actions/google_analytics'
import { UI_MODAL_KEYS } from '../../redux/constants/modals'
import { UI_KEYS } from '../../redux/constants/ui_keys'
import { ORDER_SHAPE } from '../../constants/prop-types-shapes'
import { LOG_LEVELS } from '../../constants/logging'
import PanelIconButton from '../../ui/Panel/Panel.IconButton'

const debug = Debug('hfui:c:algo-order-action')

const AlgoOrderActions = ({
  order,
  isInAlgoOrderDetailsModal,
}) => {
  const tooltipRef = useRef(null)
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { gid } = order

  const gaCancelOrder = () => {
    dispatch(GAActions.cancelAO())
  }

  const cancelOrder = () => {
    debug('cancelling algo order %d', gid)

    dispatch(WSActions.cancelAlgoOrder(gid))
    dispatch(
      UIActions.logInformation(
        `User requested the cancellation of algorithmic order with ID ${gid}`,
        LOG_LEVELS.INFO,
        'ao_cancelled',
      ),
    )
    gaCancelOrder()
  }

  const editOrder = () => {
    dispatch(UIActions.setUIValue(UI_KEYS.orderToEdit, order))
    dispatch(
      UIActions.changeUIModalState(UI_MODAL_KEYS.EDIT_ORDER_MODAL, true),
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
            <Item onClick={editOrder}>
              {t('table.edit')}
            </Item>
            <Item onClick={cancelOrder}>
              {t('table.cancelRemaining')}
            </Item>
          </div>
        )}
      >
        {isInAlgoOrderDetailsModal ? (
          <PanelIconButton
            onClick={() => {}}
            icon={<Icon name='ellipsis-v' aria-label='More options' />}
          />
        ) : (
          <Icon
            className='more-options-button'
            name='ellipsis-v'
            aria-label='More options'
          />
        )}
      </Tooltip>
    </div>
  )
}

AlgoOrderActions.propTypes = {
  order: PropTypes.shape(ORDER_SHAPE).isRequired,
  isInAlgoOrderDetailsModal: PropTypes.bool,
}

AlgoOrderActions.defaultProps = {
  isInAlgoOrderDetailsModal: false,
}

export default AlgoOrderActions
