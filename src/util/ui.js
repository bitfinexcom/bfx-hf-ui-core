import React from 'react'
import _findIndex from 'lodash/findIndex'
import _size from 'lodash/size'
import _split from 'lodash/split'
import _toArray from 'lodash/toArray'
import _toString from 'lodash/toString'
import _reverse from 'lodash/reverse'
import _truncate from 'lodash/truncate'
import cx from 'classnames'

// takes a number as input and returns a localised version with semicolons in it
// e.g. 123456789.445566 -> '123,456,789.445566'
export const localiseNumber = (x = 'N/A') => x.toLocaleString('en-US')

export const processBalance = (value, localise = true) => {
  let str = _toString(value)

  if (localise) {
    str = localiseNumber(value)
  } else {
    str = _toString(value)
  }

  if (!_toString(_split(value, '.')[1])) {
    return str
  }

  const size = _size(str)
  const id = _findIndex(_reverse(_toArray(str)), el => +el !== 0)

  return (
    <>
      {str.substr(0, size - id)}
      <span className='trailing-zeros'>
        {str.substr(size - id, size)}
      </span>
    </>
  )
}

// if name is longer than a limit - the rest of letters are replaced with '...'
export const makeShorterLongName = (name, limit) => _truncate(name, {
  length: limit,
  omission: '...',
})

export const reactVirtualizedCellRenderer = (value, formattedValue = value, coloredCell = false) => (
  <span
    title={value}
    className={cx('text-overflow', {
      'hfui-red': coloredCell && value < 0,
      'hfui-green': coloredCell && value >= 0,
    })}
  >
    {formattedValue}
  </span>
)
