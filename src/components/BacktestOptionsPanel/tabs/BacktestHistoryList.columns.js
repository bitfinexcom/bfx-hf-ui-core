import React from 'react'
import { Button } from '@ufx-ui/core'
import { Icon } from 'react-fa'
import { renderDate } from '../../../util/ui'
import FavoriteIcon from '../../../ui/Icons/FavoriteIcon'

export default ({
  toggleFavorite,
  formatTime,
  removeBacktestFromHistory,
  t,
}) => [
  {
    dataKey: 'executionId',
    width: 25,
    flexGrow: 0.1,
    disableSort: true,
    cellRenderer: ({ rowData: { isFavorite, executionId } = {} }) => {
      const handleFavIconClick = (e) => {
        e.stopPropagation()
        toggleFavorite(executionId, !isFavorite)
      }

      return (
        <div className='fav-col'>
          <Button minimal onClick={handleFavIconClick}>
            <FavoriteIcon
              className='hfui-history-button__icon'
              nonFilled={!isFavorite}
              isSelected={isFavorite}
            />
          </Button>
        </div>
      )
    },
  },
  {
    dataKey: 'timestamp',
    label: t('strategyEditor.executedAt'),
    width: 100,
    flexGrow: 1,
    style: { justifyContent: 'center' },
    cellRenderer: ({ rowData = {} }) => {
      return renderDate(rowData.timestamp, formatTime)
    },
  },
  {
    dataKey: 'id',
    flexGrow: 0.1,
    width: 25,
    cellRenderer: ({ rowData: { executionId } = {} }) => {
      const handleRemoveBacktestFromHistoryButton = (e) => {
        e.stopPropagation()
        removeBacktestFromHistory(executionId)
      }
      return (
        <Button minimal onClick={handleRemoveBacktestFromHistoryButton}>
          <Icon name='trash-o' />
        </Button>
      )
    },
  },
]
