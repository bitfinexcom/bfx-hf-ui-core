import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import _toUpper from 'lodash/toUpper'
import _filter from 'lodash/filter'
import _isEmpty from 'lodash/isEmpty'
import { useTranslation } from 'react-i18next'
import { VirtualTable } from '@ufx-ui/core'
import { useDispatch, useSelector } from 'react-redux'
import FavoriteIcon from '../../../ui/Icons/FavoriteIcon'
import PanelButton from '../../../ui/Panel/Panel.Button'
import useToggle from '../../../hooks/useToggle'
import { getCurrentStrategyBacktestsList } from '../../../redux/selectors/ws'
import WSActions from '../../../redux/actions/ws'
import WSTypes from '../../../redux/constants/ws'
import BacktestHistoryListColumns from './BacktestHistoryList.columns'
import { getFormatTimeFn } from '../../../redux/selectors/ui'

const BacktestHistoryList = ({ onBacktestRowClick }) => {
  const [isFavoriteSelected, toggleFavoritesList] = useToggle(false)

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const backtests = useSelector(getCurrentStrategyBacktestsList)
  const formatTime = useSelector(getFormatTimeFn)

  const toggleFavorite = useCallback(
    (id, isFavorite) => {
      dispatch(
        WSActions.send({
          alias: WSTypes.ALIAS_DATA_SERVER,
          data: ['set.bt.history.favorite', id, isFavorite],
        }),
      )
    },
    [dispatch],
  )

  const removeBacktest = useCallback(
    (id) => {
      dispatch(
        WSActions.send({
          alias: WSTypes.ALIAS_DATA_SERVER,
          data: ['delete.bt.history', id],
        }),
      )
    },
    [dispatch],
  )

  const columns = useMemo(
    () => BacktestHistoryListColumns({
      formatTime,
      toggleFavorite,
      removeBacktest,
      t,
    }),
    [toggleFavorite, formatTime, removeBacktest, t],
  )

  const data = useMemo(() => {
    return isFavoriteSelected
      ? _filter(backtests, ({ isFavorite }) => isFavorite)
      : backtests
  }, [isFavoriteSelected, backtests])

  return (
    <>
      <div className='item'>
        <div className='hfui-strategy-backtest-options__icn-selector-container'>
          <PanelButton
            onClick={toggleFavoritesList}
            text={_toUpper(t('ui.starred'))}
            isActive={isFavoriteSelected}
            icon={(
              <FavoriteIcon
                className='hfui-history-button__icon'
                nonFilled={!isFavoriteSelected}
                isSelected={isFavoriteSelected}
              />
            )}
          />
        </div>
      </div>
      <div className='backtest-history-table'>
        {_isEmpty(data) ? (
          <p className='empty'>{t('strategyEditor.noHistoryBacktests')}</p>
        ) : (
          <VirtualTable
            data={data}
            columns={columns}
            defaultSortDirection='DESC'
            defaultSortBy='dataKey'
            onRowClick={onBacktestRowClick}
            rowHeight={30}
            disableColumnsResizing
          />
        )}
      </div>
    </>
  )
}

BacktestHistoryList.propTypes = {
  onBacktestRowClick: PropTypes.func.isRequired,
}

export default BacktestHistoryList
