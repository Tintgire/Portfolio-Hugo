import { useEffect } from 'react'
import { useLenis } from './LenisProvider'
import { setMusicProgress } from './audio/uiSounds'

function computeProgress() {
  const docHeight = document.documentElement.scrollHeight - window.innerHeight
  if (docHeight <= 0) return 0
  return Math.min(1, Math.max(0, window.scrollY / docHeight))
}

export default function MusicScrollDriver() {
  const lenis = useLenis()

  useEffect(() => {
    setMusicProgress(computeProgress())
    if (lenis) {
      const handler = () => setMusicProgress(computeProgress())
      lenis.on('scroll', handler)
      return () => lenis.off('scroll', handler)
    }
    let raf = 0
    const tick = () => {
      setMusicProgress(computeProgress())
      raf = 0
    }
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(tick)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [lenis])

  return null
}
