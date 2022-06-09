import { preparePrice } from 'bfx-api-node-util'
import { defaultCellRenderer } from '../../util/ui'
import { resultNumber } from '../Backtester/Results/Results.utils'

const STYLES = {
  flexStart: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
}

const activeStrategiesColumns = (t, getMarketPair) => [
  {
    label: t('table.name'),
    dataKey: 'label',
    style: { ...STYLES.flexStart, fontWeight: '700' },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => (defaultCellRenderer(rowData.label)),
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.pair'),
    dataKey: 'pair',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.symbol)),
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
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(resultNumber(rowData.results?.pf, null, true)),
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
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(resultNumber(preparePrice(rowData.results?.pl), 'USD')),
  },
]

const pastStrategiesColumns = (t, getMarketPair) => [
  {
    label: t('table.name'),
    dataKey: 'label',
    style: { ...STYLES.flexStart, fontWeight: '700' },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => (defaultCellRenderer(rowData.label)),
    headerStyle: STYLES.flexStart,
  },
  {
    label: t('table.pair'),
    dataKey: 'pair',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(getMarketPair(rowData.symbol)),
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
    dataKey: 'profitFactor',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(resultNumber(rowData.results?.pf, null, true)),
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
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(resultNumber(preparePrice(rowData.results?.pl), 'USD', true)),
  },
]

const savedStrategiesColumns = (t) => [
  {
    label: t('table.name'),
    dataKey: 'label',
    style: { ...STYLES.flexStart, fontWeight: '700' },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => (defaultCellRenderer(rowData.label)),
    headerStyle: STYLES.flexStart,
  },
  {
    label: 'Saved on',
    dataKey: 'savedTs',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 200,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date(rowData.savedTs).toLocaleString()),
  },
]

export {
  activeStrategiesColumns,
  pastStrategiesColumns,
  savedStrategiesColumns,
}
