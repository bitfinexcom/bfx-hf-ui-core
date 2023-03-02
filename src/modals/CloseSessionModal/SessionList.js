import React from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router'
import { useTranslation } from 'react-i18next'
import {
  getFilteredLocalAlgoOrders,
  getSortedByTimeActiveStrategies,
  getSortedByTimeStrategies,
} from '../../redux/selectors/ws'
import {
  getMarketPair,
  getMarketsForExecution,
} from '../../redux/selectors/meta'
import { changeMode, setCurrentStrategy } from '../../redux/actions/ui'
import routes from '../../constants/routes'
import { getIsPaperTrading } from '../../redux/selectors/ui'
import { prepareStrategyToLoad } from '../../components/StrategyEditor/StrategyEditor.helpers'
import { MAIN_MODE } from '../../redux/reducers/ui'

const SessionList = ({ onModalClose, openAODetailsModal }) => {
  const activeStrategies = useSelector(getSortedByTimeActiveStrategies())
  const _getMarketPair = useSelector(getMarketPair)
  const isPaperTrading = useSelector(getIsPaperTrading)
  const algoOrders = useSelector(getFilteredLocalAlgoOrders)
  const savedStrategies = useSelector(getSortedByTimeStrategies)
  const markets = useSelector(getMarketsForExecution)

  const dispatch = useDispatch()
  const { push } = useHistory()
  const { t } = useTranslation()
  const { pathname } = useLocation()

  const onStrategyClick = (strategy) => {
    if (isPaperTrading) {
      dispatch(changeMode(false))
    }

    const newStrategyObject = prepareStrategyToLoad(
      strategy,
      markets,
      savedStrategies,
    )

    dispatch(setCurrentStrategy(newStrategyObject, MAIN_MODE))

    const { path: strategyEditorPath } = routes.strategyEditor
    if (pathname !== strategyEditorPath) {
      push(strategyEditorPath)
    }

    onModalClose()
  }

  return (
    <ul className='close-session-modal__orders-list'>
      {_map(activeStrategies, (strategy) => (
        <li key={strategy.id} className='close-session-modal__orders-list-item'>
          <span>{t('closeSessionModal.strategy')}</span>
          &nbsp;
          <span
            className='primary-label'
            onClick={() => onStrategyClick(strategy)}
          >
            {strategy.label}
          </span>
          &nbsp;
          <span className='secondary-label'>
            (
            {_getMarketPair(strategy?.symbol)}
            ,&nbsp;
            {t('closeSessionModal.startedOn', {
              time: new Date(strategy.startedOn).toLocaleString(),
            })}
            )
          </span>
        </li>
      ))}
      {_map(algoOrders, (order) => (
        <li className='close-session-modal__orders-list-item' key={order.gid}>
          <span
            className='primary-label'
            onClick={openAODetailsModal.bind(this, order.gid)}
          >
            {order.label}
          </span>
          &nbsp;
          <span className='secondary-label'>
            {_getMarketPair(order?.args?.symbol)}
          </span>
        </li>
      ))}
    </ul>
  )
}

SessionList.propTypes = {
  onModalClose: PropTypes.func.isRequired,
  openAODetailsModal: PropTypes.func.isRequired,
}

export default SessionList
