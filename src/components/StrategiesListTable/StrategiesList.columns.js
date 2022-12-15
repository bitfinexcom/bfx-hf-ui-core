/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { Icon } from 'react-fa'
import _isEmpty from 'lodash/isEmpty'
import { preparePrice } from 'bfx-api-node-util'
import { defaultCellRenderer } from '../../util/ui'
import resultNumber from '../../util/resultNumber'

const STYLES = {
  flexStart: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
  flexEnd: { justifyContent: 'flex-end' },
}

const activeStrategiesColumns = (t, getMarketPair) => [
  {
    label: t('table.name'),
    dataKey: 'label',
    style: { ...STYLES.flexStart, fontWeight: '700' },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.label),
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.pair'),
    dataKey: 'pair',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.strategyOptions?.symbol)),
  },
  {
    label: t('table.runningSince'),
    dataKey: 'startedOn',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 200,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.startedOn).toLocaleString()),
  },
  // {
  //   label: t('table.leverage'),
  //   dataKey: 'leverage',
  //   style: STYLES.flexStart,
  //   headerStyle: STYLES.flexStart,
  //   width: 100,
  //   flexGrow: 1,
  //   cellRenderer: ({ rowData = {} }) => defaultCellRenderer('10x'),
  // },
  {
    label: t('strategyEditor.profitFactor'),
    dataKey: 'profitFactor',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => resultNumber(rowData.results?.pf, null, rowData.results?.pf >= 1),
  },
  // {
  //   label: t('table.sharpeRatio'),
  //   dataKey: 'sharpeRatio',
  //   style: STYLES.flexStart,
  //   headerStyle: STYLES.flexStart,
  //   width: 100,
  //   flexGrow: 1,
  //   cellRenderer: ({ rowData = {} }) => defaultCellRenderer('1.98'),
  // },
  {
    label: t('table.pl'),
    dataKey: 'sharpeRatio',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => resultNumber(preparePrice(rowData.results?.pl), 'USD'),
  },
]

const pastStrategiesColumns = (t, getMarketPair) => [
  {
    label: t('table.name'),
    dataKey: 'label',
    style: { ...STYLES.flexStart, fontWeight: '700' },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.label),
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.pair'),
    dataKey: 'strategyOptions.symbol',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.strategyOptions?.symbol)),
  },
  {
    label: t('table.startedOn'),
    dataKey: 'startedOn',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 200,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.startedOn).toLocaleString()),
  },
  {
    label: t('table.stoppedOn'),
    dataKey: 'stoppedOn',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 200,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.stoppedOn).toLocaleString()),
  },
  // {
  //   label: t('table.leverage'),
  //   dataKey: 'leverage',
  //   style: STYLES.flexStart,
  //   headerStyle: STYLES.flexStart,
  //   width: 100,
  //   flexGrow: 1,
  //   cellRenderer: ({ rowData = {} }) => defaultCellRenderer('10x'),
  // },
  {
    label: t('strategyEditor.profitFactor'),
    dataKey: 'results.pf',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => resultNumber(rowData.results?.pf, null, rowData.results?.pf >= 1),
  },
  // {
  //   label: t('table.sharpeRatio'),
  //   dataKey: 'sharpeRatio',
  //   style: STYLES.flexStart,
  //   headerStyle: STYLES.flexStart,
  //   width: 100,
  //   flexGrow: 1,
  //   cellRenderer: ({ rowData = {} }) => defaultCellRenderer('1.98'),
  // },
  {
    label: t('table.pl'),
    dataKey: 'results.pl',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => resultNumber(preparePrice(rowData.results?.pl), 'USD'),
  },
]

const SavedStrategiesActions = ({
  t,
  rowData,
  onStrategyRemove,
  saveAsHandler,
  renameStrategy,
}) => {
  const [activeAction, setActiveAction] = useState(null)

  const onActionClick = (action) => (e) => {
    e.stopPropagation()
    action(rowData)
  }

  return (
    <div className='list-actions'>
      <p>{activeAction}</p>
      <Icon
        name='copy'
        aria-label={t('strategyEditor.copyStrategy')}
        onClick={onActionClick(saveAsHandler)}
        onMouseEnter={() => setActiveAction(t('strategyEditor.copyStrategy'))}
        onMouseLeave={() => setActiveAction(null)}
      />
      <Icon
        name='pencil'
        aria-label={t('strategyEditor.renameStrategy')}
        onClick={onActionClick(renameStrategy)}
        onMouseEnter={() => setActiveAction(t('strategyEditor.renameStrategy'))}
        onMouseLeave={() => setActiveAction(null)}
      />
      <Icon
        name='trash-o'
        aria-label={t('strategyEditor.deleteStrategy')}
        onClick={onActionClick(onStrategyRemove)}
        onMouseEnter={() => setActiveAction(t('strategyEditor.deleteStrategy'))}
        onMouseLeave={() => setActiveAction(null)}
      />
    </div>
  )
}

const savedStrategiesColumns = ({
  t,
  onStrategyRemove,
  saveAsHandler,
  renameStrategy,
}) => [
  {
    label: t('table.name'),
    dataKey: 'label',
    style: { ...STYLES.flexStart, fontWeight: '700' },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(rowData.label),
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.pair'),
    dataKey: 'strategyOptions.symbol',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => {
      const { strategyOptions: { symbol = null } = {} } = rowData
      const isMarketSelected = !_isEmpty(symbol)
      const value = isMarketSelected ? symbol?.uiID : '-'

      return defaultCellRenderer(value)
    },
  },
  {
    label: t('table.strategyType'),
    dataKey: 'strategyOptions.strategyType',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => {
      const { strategyOptions: { strategyType = null } = {} } = rowData
      let value = '-'

      if (strategyType?.customValue) {
        value = strategyType.customValue
      } else if (strategyType?.i18nKey) {
        value = t(strategyType.i18nKey)
      }

      return defaultCellRenderer(value)
    },
  },
  {
    label: t('table.savedOn'),
    dataKey: 'savedTs',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 200,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.savedTs).toLocaleString()),
  },
  {
    dataKey: 'id',
    style: STYLES.flexEnd,
    width: 400,
    flexGrow: 1,
    cellRenderer: (props) => (
      <SavedStrategiesActions
        {...props}
        t={t}
        onStrategyRemove={onStrategyRemove}
        saveAsHandler={saveAsHandler}
        renameStrategy={renameStrategy}
      />
    ),
  },
]

export {
  activeStrategiesColumns,
  pastStrategiesColumns,
  savedStrategiesColumns,
}
