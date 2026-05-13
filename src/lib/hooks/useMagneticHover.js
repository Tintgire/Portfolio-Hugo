import { useEffect } from 'react'
import { useMotionValue, useSpring } from 'framer-motion'
import { useReducedMotion } from './useReducedMotion'

export function useMagneticHover(ref, { strength = 0.4, max = 10 } = {}) {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 180, damping: 18, mass: 0.6 })
  const y = useSpring(rawY, { stiffness: 180, damping: 18, mass: 0.6 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      rawX.set(Math.max(-max, Math.min(max, dx)))
      rawY.set(Math.max(-max, Math.min(max, dy)))
    }
    const onLeave = () => {
      rawX.set(0)
      rawY.set(0)
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      rawX.set(0)
      rawY.set(0)
    }
  }, [ref, strength, max, rawX, rawY, reduced])

  return { x, y }
}
