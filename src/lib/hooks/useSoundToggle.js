import { useCallback, useEffect, useState } from 'react'
import { isSoundEnabled, setSoundEnabled, playToggle, setMusicActive } from '../audio/uiSounds'

export function useSoundToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const initial = isSoundEnabled()
    setEnabled(initial)
    if (initial) setMusicActive(true)
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      setSoundEnabled(next)
      if (next) {
        playToggle()
        setMusicActive(true)
      } else {
        setMusicActive(false)
      }
      return next
    })
  }, [])

  return { enabled, toggle }
}
