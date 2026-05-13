import { motion, useScroll, useTransform } from 'framer-motion'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { styles } from '../styles'
import { ComputersCanvas } from './canvas'

import '../index.css'

const Hero = () => {
  const [currentText, setCurrentText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isPageVisible, setPageVisible] = useState(true)
  const [animationInProgress, setAnimationInProgress] = useState(false)

  const texts = useMemo(
    () => ['Hugo', 'AI Product Engineer', 'Full-Stack & Mobile', 'Automation & AI Agents'],
    []
  )

  const startTypingAnimation = useCallback(() => {
    if (!isPageVisible || animationInProgress) return

    setAnimationInProgress(true)
    const animationDuration = 200
    const text = texts[textIndex]

    setCurrentText('')

    let currentIndex = 0
    const animateText = () => {
      if (!isPageVisible) {
        setAnimationInProgress(false)
        return
      }

      if (currentIndex <= text.length) {
        setCurrentText(text.slice(0, currentIndex))
        currentIndex++
        setTimeout(animateText, animationDuration)
      } else {
        setTimeout(() => {
          setTextIndex((prevIndex) => (prevIndex + 1) % texts.length)
          setAnimationInProgress(false)
        }, 800)
      }
    }

    animateText()
  }, [texts, textIndex, isPageVisible, animationInProgress])

  useEffect(() => {
    const handleVisibilityChange = () => {
      setPageVisible(!document.hidden)
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  useEffect(() => {
    startTypingAnimation()
    const intervalId = setInterval(startTypingAnimation, 12000)
    return () => {
      clearInterval(intervalId)
    }
  }, [startTypingAnimation])

  const { scrollY } = useScroll()
  const canvasOpacity = useTransform(
    scrollY,
    [0, typeof window !== 'undefined' ? window.innerHeight * 0.6 : 600],
    [1, 0]
  )

  return (
    <section className="relative w-80vw h-screen mx-auto overflow-hidden">
      <div
        className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className={`${styles.heroHeadText} text-white break-words`}>
            Hi, I'm{' '}
            <span className="text-[#915EFF] text sec-text">{currentText}</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            Portfolio avec des visuels 3D, <br className="sm:block hidden" />
            interfaces et web applications
          </p>
        </div>
      </div>
      <motion.div className="absolute inset-0" style={{ opacity: canvasOpacity }}>
        <ComputersCanvas />
      </motion.div>
      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[30px] h-[50px] rounded-3xl border-4 border-secondary flex justify-center items-start p-1">
            <motion.div
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: 'loop',
              }}
              className="w-2 h-2 rounded-full bg-secondary mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  )
}

export default Hero
