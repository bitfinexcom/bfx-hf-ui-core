import React from 'react'
import { Button } from '@ufx-ui/core'
import { Icon } from 'react-fa'
import { renderDate } from '../../util/ui'
import FavoriteIcon from '../../ui/Icons/FavoriteIcon'

export default ({ toggleFavorite, formatTime, removeBacktest }) => [
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
    width: 100,
    flexGrow: 1,
    style: { justifyContent: 'center' },
    cellRenderer: ({ rowData = {} }) => {
      return renderDate(rowData.timestamp, formatTime)
    },
    disableSort: true,
  },
  {
    dataKey: 'id',
    flexGrow: 0.1,
    width: 25,
    cellRenderer: ({ rowData: { executionId } = {} }) => {
      const handleRemoveBacktestButton = (e) => {
        e.stopPropagation()
        removeBacktest(executionId)
      }
      return (
        <Button minimal onClick={handleRemoveBacktestButton}>
          <Icon name='trash-o' />
        </Button>
      )
    },
  },
]
