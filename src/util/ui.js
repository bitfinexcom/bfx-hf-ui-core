import React from 'react'
import _findIndex from 'lodash/findIndex'
import _size from 'lodash/size'
import _split from 'lodash/split'
import _toArray from 'lodash/toArray'
import _toString from 'lodash/toString'
import _reverse from 'lodash/reverse'
import _truncate from 'lodash/truncate'
import _replace from 'lodash/replace'
import { Truncate } from '@ufx-ui/core'

const LS_LAST_SESSION_TIMESTAMP = 'LS_LAST_SESSION_TIMESTAMP'

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

export const defaultCellRenderer = (content) => (
  <Truncate
    placement='bottom'
  >
    {content}
  </Truncate>
)

export const saveAsJSON = (obj, fileName) => {
  const data = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(obj, null, 2))}`
  const node = document.createElement('a')
  node.setAttribute('href', data)
  node.setAttribute('download', `${fileName}.json`)
  document.body.appendChild(node)
  node.click()
  node.remove()
}

export const readJSONFile = () => new Promise((resolve, reject) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/JSON'

  input.onchange = () => {
    const strategyJSONRaw = input.files[0]
    const fr = new FileReader()

    fr.addEventListener('load', () => {
      try {
        resolve(JSON.parse(fr.result))
      } catch (e) {
        reject(e)
      }
    })

    fr.readAsText(strategyJSONRaw)
  }

  input.click()
  input.remove()
})

export const renderDate = (rawDate, formatTime, shouldTruncate = true) => {
  if (!rawDate) {
    return '--'
  }
  const date = formatTime(rawDate)

  return shouldTruncate ? defaultCellRenderer(date) : date
}

export const processDateForCSV = (rawDate, formatTime) => {
  if (!rawDate) {
    return '--'
  }
  const date = formatTime(rawDate)
  return _replace(date, ',', '')
}

export const saveLastSessionTimestamp = () => localStorage.setItem(LS_LAST_SESSION_TIMESTAMP, Date.now())

export const getLastSessionTimestamp = () => {
  const ts = localStorage.getItem(LS_LAST_SESSION_TIMESTAMP)
  if (ts) {
    return Number(ts)
  }
  return Date.now()
}
