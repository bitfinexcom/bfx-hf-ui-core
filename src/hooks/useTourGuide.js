import { useEffect, useState } from 'react'

const useTourGuide = (isGuideActive) => {
  const [isGuideActiveLocal, setIsGuideActiveLocal] = useState(false)

  // delay guide active status to avoid missing guide spotlight because of target not found error
  useEffect(() => {
    const delay = isGuideActive ? 500 : 0
    setTimeout(() => {
      setIsGuideActiveLocal(isGuideActive)
    }, delay)
  }, [isGuideActive])

  return isGuideActiveLocal
}

export default useTourGuide
