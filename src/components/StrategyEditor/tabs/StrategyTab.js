import React, { memo } from 'react'
import GridLayout, { WidthProvider } from 'react-grid-layout'
import ChartPanel from '../../ChartPanel'
import StrategyPerfomanceMetrics from '../../StrategyPerfomanceMetrics'
import StrategyTradesTable from '../../StrategyTradesTable'
import { results } from '../../../pages/StrategyEditor/mock_data'

const ReactGridLayout = WidthProvider(GridLayout)

const StrategyTab = ({ onLoadStrategy }) => {
  const layouts = [
    {
      i: 'a', x: 10, y: 0, w: 60, h: 7,
    },
    {
      i: 'b', x: 70, y: 0, w: 30, h: 7,
    },
    {
      i: 'c', x: 10, y: 7, w: 100, h: 5,
    },
  ]

  return (
    <div className='hfui-strategyeditor__wrapper'>
      <ReactGridLayout
        cols={100}
        rowHeight={30}
        measureBeforeMount
        layout={layouts}
        margin={[10, 10]}
      >
        <div key='a'>
          <ChartPanel />
        </div>
        <div key='b'>
          <StrategyPerfomanceMetrics results={results} />
        </div>
        <div key='c'>
          <StrategyTradesTable results={results} />
        </div>
      </ReactGridLayout>
      <GridLayout sharedProps={{
        onLoadStrategy,
        results,
      }}
      />
    </div>
  )
}

export default memo(StrategyTab)
