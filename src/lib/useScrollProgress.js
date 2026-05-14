import { useEffect } from 'react'
import { useMotionValue } from 'framer-motion'
import { useLenis } from './LenisProvider'

// Lenis-aware drop-in for framer-motion's `useScroll().scrollYProgress`.
//
// Why a custom hook: Lenis intercepts wheel events and drives scrolling via
// requestAnimationFrame, so the browser's native `scroll` event no longer
// fires for smooth wheel scrolling. framer-motion's useScroll listens to
// native scroll events, which means with Lenis active it never updates.
// Subscribing to `lenis.on('scroll')` instead keeps the MotionValue in sync.
//
// Behaviour mirrors `useScroll({ target: ref, offset: ['start center', 'end center'] })`:
//   - progress = 0 when the top of the target crosses viewport center
//   - progress = 1 when the bottom of the target crosses viewport center
//   - linearly interpolates (and clamps) between those two anchors
export default function useScrollProgress(ref) {
  const lenis = useLenis()
  const progress = useMotionValue(0)

  useEffect(() => {
    if (!ref.current) return

    const compute = () => {
      const node = ref.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const vh = window.innerHeight
      // Start anchor: target.top == viewport center
      // End anchor:   target.bottom == viewport center
      // The amount we have "scrolled past" the start anchor is
      // (vh/2 - rect.top), and the total distance between start & end is
      // rect.height.
      const traveled = vh / 2 - rect.top
      const total = rect.height
      const p = total > 0 ? Math.max(0, Math.min(1, traveled / total)) : 0
      progress.set(p)
    }
    compute()

    const onResize = () => compute()
    window.addEventListener('resize', onResize)

    if (lenis) {
      const handler = () => compute()
      lenis.on('scroll', handler)
      return () => {
        lenis.off('scroll', handler)
        window.removeEventListener('resize', onResize)
      }
    }

    // No Lenis (e.g. prefers-reduced-motion) → fall back to native scroll
    const onScroll = () => compute()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
    }
  }, [ref, lenis, progress])

  return progress
}
