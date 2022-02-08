import { useEffect, useState } from 'react'

const useTourGuide = (isGuideActive) => {
  const [isGuideActiveLocal, setIsGuideActiveLocal] = useState(false)

  // delay guide active status to avoid missing guide spotlight because of target not found error
  useEffect(() => {
    const delay = isGuideActive ? 500 : 0
    let isMounted = true

    setTimeout(() => {
      if (isMounted) {
        setIsGuideActiveLocal(isGuideActive)
      }
    }, delay)

    return () => {
      isMounted = false
    }
  }, [isGuideActive])

  return isGuideActiveLocal
}

export default useTourGuide
