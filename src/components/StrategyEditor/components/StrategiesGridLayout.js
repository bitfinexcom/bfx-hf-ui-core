import React from 'react'
import PropTypes from 'prop-types'
import _map from 'lodash/map'
import { AutoSizer } from 'react-virtualized'
import ReactGridLayout from 'react-grid-layout'
import ClassNames from 'clsx'
import { Spinner } from '@ufx-ui/core'
import { useTranslation } from 'react-i18next'
import { STRATEGY_LAYOUT_CONFIG_SHAPE } from '../../../constants/prop-types-shapes'

const GRID_LAYOUT_MIN_HEIGHT = 530

const StrategiesGridLayout = ({
  renderGridComponents, layoutConfig, isLoading, onCancelProcess,
}) => {
  const { t } = useTranslation()

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
            {isLoading && (
              <>
                <Spinner className='spinner' />
                <button type='button' onClick={onCancelProcess} className='hfui-strategy-editor_cancel-process-btn'>
                  {t('strategyEditor.cancelThisProcess')}
                </button>
              </>
            )}
          </>
        )
      }}
    </AutoSizer>
  )
}

StrategiesGridLayout.propTypes = {
  renderGridComponents: PropTypes.func.isRequired,
  layoutConfig: PropTypes.arrayOf(PropTypes.shape(STRATEGY_LAYOUT_CONFIG_SHAPE)),
  isLoading: PropTypes.bool,
  onCancelProcess: PropTypes.func,
}

StrategiesGridLayout.defaultProps = {
  isLoading: false,
  layoutConfig: [],
  onCancelProcess: () => {},
}

export default StrategiesGridLayout
