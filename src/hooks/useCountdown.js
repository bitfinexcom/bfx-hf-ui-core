import { useState, useEffect } from 'react'

const useCountdown = (initialCount, isActive = true) => {
  const [countdown, setCountdown] = useState(initialCount)

  useEffect(() => {
    let timer
    if (isActive && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1)
      }, 1000)
    }
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [isActive, countdown])

  const resetCountdown = () => setCountdown(initialCount)

  return { countdown, isFinished: countdown === 0, resetCountdown }
}

export default useCountdown
