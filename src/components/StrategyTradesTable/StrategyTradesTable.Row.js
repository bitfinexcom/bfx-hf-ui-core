/* eslint-disable react/prop-types */
import React, { useEffect } from 'react'
import { CellMeasurer, CellMeasurerCache } from 'react-virtualized'
import cx from 'clsx'

import TradesTable from './TradesTable'

export const rowCache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 27,
})

const STYLES = {
  VERTICAL: { display: 'flex', flexDirection: 'column' },
  HORIZONTAL: { display: 'flex', flexDirection: 'row' },
}

const ROW_HEIGHT_COLLAPSED = 27

const MAIN_ROW = ((props) => {
  const {
    selectedIndex, rowIndex, registerChild, measure, rowData, columns, style,
  } = props

  useEffect(() => {
    measure()
  }, [measure, selectedIndex])

  const showExpanedView = rowIndex === selectedIndex
  const height = showExpanedView ? style.height : ROW_HEIGHT_COLLAPSED
  const top = (rowIndex > 0 && style?.top === 0) ? height + ((rowIndex - 1) * ROW_HEIGHT_COLLAPSED) : style?.top

  return (
    <div
      ref={registerChild}
      style={{
        ...style,
        height,
        top,
      }}
    >
      <div style={STYLES.VERTICAL}>
        <div
          style={STYLES.HORIZONTAL}
          className={cx('stratatey-main-row', {
            selected: showExpanedView,
          })}
        >
          {columns}
        </div>
        {showExpanedView ? (<TradesTable data={rowData?.trades} />) : null}
      </div>
    </div>
  )
})

// eslint-disable-next-line react/display-name
export const getRowRenderer = (selectedIndex) => (props) => {
  const {
    parent, index, key, rowData, columns: rowCols,
  } = props

  return (
    <CellMeasurer
      cache={rowCache}
      key={key}
      parent={parent || {}}
      columnIndex={0}
      rowIndex={index}
    >
      {({ measure, registerChild }) => (
        <MAIN_ROW
          {...props}
          rowIndex={index}
          selectedIndex={selectedIndex}
          columns={rowCols}
          measure={measure}
          registerChild={registerChild}
          rowData={rowData}
        />
      )}
    </CellMeasurer>
  )
}
