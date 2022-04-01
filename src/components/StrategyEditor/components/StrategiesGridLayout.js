import React from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { AutoSizer } from 'react-virtualized'
import ReactGridLayout from 'react-grid-layout'

const StrategiesGridLayout = ({ renderGridComponents, layoutConfig }) => {
  return (
    <AutoSizer>
      {({ width, height }) => {
        return (
          <ReactGridLayout
            cols={100}
            rowHeight={height / 10}
            width={width}
            layout={layoutConfig}
            margin={[10, 10]}
          >
            {_map(layoutConfig, (c) => {
              const { i } = c
              return (
                <div key={i}>
                  {renderGridComponents(i)}
                </div>
              )
            })}
          </ReactGridLayout>
        )
      }}
    </AutoSizer>
  )
}

StrategiesGridLayout.propTypes = {
  renderGridComponents: PropTypes.func.isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default StrategiesGridLayout
