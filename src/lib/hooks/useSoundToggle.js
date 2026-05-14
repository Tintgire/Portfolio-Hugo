import { useCallback, useEffect, useState } from 'react'
import { isSoundEnabled, setSoundEnabled, playToggle, setMusicActive } from '../audio/uiSounds'

const SOUND_CHANGE_EVENT = 'portfolio:sound-enabled-change'

export function useSoundToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const sync = () => {
      const cur = isSoundEnabled()
      setEnabled(cur)
      if (cur) setMusicActive(true)
    }
    sync()
    window.addEventListener(SOUND_CHANGE_EVENT, sync)
    return () => window.removeEventListener(SOUND_CHANGE_EVENT, sync)
  }, [])

  const toggle = useCallback(() => {
    const next = !isSoundEnabled()
    setSoundEnabled(next)
    if (next) {
      playToggle()
      setMusicActive(true)
    } else {
      setMusicActive(false)
    }
  }, [])

  return { enabled, toggle }
}
