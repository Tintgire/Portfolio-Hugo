import { useEffect, useState } from 'react'

/**
 * Returns true when the user has requested reduced motion via OS settings.
 * SSR-safe (returns false on the server, then matches the actual preference after mount).
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const onChange = (e) => setReduced(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return reduced
}
