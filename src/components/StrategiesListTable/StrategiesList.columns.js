import { defaultCellRenderer } from '../../util/ui'
import { resultNumber } from '../Backtester/Results/Results.utils'
import StrategyRunned from '../StrategyEditor/components/StrategyRunned'
import StrategyPaused from '../StrategyEditor/components/StrategyPaused'

const STYLES = {
  flexStart: { justifyContent: 'flex-start' },
  center: { justifyContent: 'center' },
}

export default (t) => [
  {
    label: t('table.name'),
    dataKey: 'name',
    style: { ...STYLES.flexStart, fontWeight: 700 },
    width: 300,
    flexGrow: 1.5,
    cellRenderer: ({ rowData = {} }) => (defaultCellRenderer(rowData.label)),
    headerStyle: STYLES.flexStart,
  },
  // {
  //   dataKey: 'status',
  //   width: 250,
  //   style: STYLES.center,
  //   cellRenderer: ({ rowData = {} }) => {
  //     const isRunned = true
  //     return isRunned ? <StrategyRunned /> : <StrategyPaused />
  //   },
  // },
  {
    label: t('table.pair'),
    dataKey: 'pair',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer('BTCUSD'),
  },
  {
    label: t('table.runningSince'),
    dataKey: 'mts',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 200,
    flexGrow: 1.25,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(new Date().toLocaleString()),
  },
  {
    label: t('table.leverage'),
    dataKey: 'leverage',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer('10x'),
  },
  {
    label: t('strategyEditor.profitFactor'),
    dataKey: 'profitFactor',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer('1.98'),
  },
  {
    label: t('table.sharpeRatio'),
    dataKey: 'sharpeRatio',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer('1.98'),
  },
  {
    label: t('table.pl'),
    dataKey: 'sharpeRatio',
    style: STYLES.flexStart,
    headerStyle: STYLES.flexStart,
    width: 100,
    flexGrow: 1,
    cellRenderer: ({ rowData = {} }) => defaultCellRenderer(resultNumber(1.005, 'USD')),
  },
]
