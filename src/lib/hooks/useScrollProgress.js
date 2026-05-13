import { useEffect, useState } from 'react'

/**
 * Page scroll progress, 0 at top, 1 at bottom.
 */
export function usePageScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const compute = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute, { passive: true })
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [])

  return progress
}

/**
 * Progress 0→1 of an element traversing the viewport.
 * 0 just before its top enters from below.
 * 1 just after its bottom exits at the top.
 */
export function useElementScrollProgress(ref) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const compute = () => {
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = rect.height + vh
      const passed = vh - rect.top
      setProgress(Math.min(1, Math.max(0, passed / total)))
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute, { passive: true })
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ref])

  return progress
}
