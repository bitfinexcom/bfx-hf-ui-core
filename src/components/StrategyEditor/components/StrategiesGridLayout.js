import React from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { AutoSizer } from 'react-virtualized'
import ReactGridLayout from 'react-grid-layout'
import ClassNames from 'clsx'
import { Spinner } from '@ufx-ui/core'

const GRID_LAYOUT_MIN_HEIGHT = 530

const StrategiesGridLayout = ({ renderGridComponents, layoutConfig, isLoading }) => {
  return (
    <AutoSizer>
      {({ width, height }) => {
        const _height = height > GRID_LAYOUT_MIN_HEIGHT ? height : GRID_LAYOUT_MIN_HEIGHT
        return (
          <>
            <ReactGridLayout
              cols={100}
              rowHeight={_height / 11}
              width={width}
              layout={layoutConfig}
              margin={[10, 10]}
              allowOverlap
              isDraggable={false}
              isResizable={false}
              className={ClassNames({ blur: isLoading })}
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
            {isLoading && <Spinner className='spinner' />}
          </>
        )
      }}
    </AutoSizer>
  )
}

StrategiesGridLayout.propTypes = {
  renderGridComponents: PropTypes.func.isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.object), // eslint-disable-line
  isLoading: PropTypes.bool,
}

StrategiesGridLayout.defaultProps = {
  isLoading: false,
  layoutConfig: [],
}

export default StrategiesGridLayout
