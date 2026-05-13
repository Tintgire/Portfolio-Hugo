import { useEffect, useState } from 'react'

/**
 * Returns true when the viewport width is below `maxWidth`.
 * Re-evaluates on viewport resize. SSR-safe.
 */
export function useIsMobile(maxWidth = 500) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${maxWidth - 1}px)`)
    setIsMobile(mq.matches)
    const onChange = (e) => setIsMobile(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [maxWidth])

  return isMobile
}
