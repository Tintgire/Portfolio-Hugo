import { useCallback, useEffect, useState } from 'react'
import { isSoundEnabled, setSoundEnabled, playToggle } from '../audio/uiSounds'

export function useSoundToggle() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(isSoundEnabled())
  }, [])

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev
      setSoundEnabled(next)
      if (next) playToggle()
      return next
    })
  }, [])

  return { enabled, toggle }
}
