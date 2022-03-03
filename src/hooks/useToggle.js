import { useState, useCallback } from 'react'

// Hook
const useToggle = (initialState = false) => {
  // Initialize the state
  const [state, setState] = useState(initialState)

  // Define and memorize setstate functions in case we pass down the comopnent,
  // toggle: change the boolean value to it's opposite value
  const toggle = useCallback(() => setState(_state => !_state), [])

  const setTrue = useCallback(() => setState(true), [])

  const setFalse = useCallback(() => setState(false), [])

  return [state, toggle, setTrue, setFalse]
}

export default useToggle
