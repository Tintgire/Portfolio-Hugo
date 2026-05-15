import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'

import { styles } from '../styles.js'
import { navLinks } from '../constans'
import { kitsune } from '../assets'
import SoundToggle from './SoundToggle'
import { playClick } from '../lib/audio/uiSounds'

const SOCIAL = {
  email: 'boidinhugo14@gmail.com',
  github: 'https://github.com/Tintgire',
  linkedin: 'https://www.linkedin.com/in/hugoboidin/',
}

// Animated burger that morphs into an X on toggle. Two bars rotate to
// form the X; framer-motion handles the spring on `rotate` / `y`.
const BurgerIcon = ({ open }) => (
  <span className="relative w-6 h-6 flex flex-col justify-center items-center">
    <motion.span
      className="block h-[2px] w-6 bg-white rounded-full"
      animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: -4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
    <motion.span
      className="block h-[2px] w-6 bg-white rounded-full"
      animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 4 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    />
  </span>
)

const IconMail = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 7 9-7" />
  </svg>
)
const IconLinkedIn = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM8.34 18.34H5.67V9.67h2.67v8.67zM7 8.5a1.55 1.55 0 110-3.1 1.55 1.55 0 010 3.1zm11.34 9.84h-2.67v-4.17c0-1-.02-2.27-1.38-2.27-1.38 0-1.6 1.08-1.6 2.2v4.24h-2.67V9.67h2.56v1.18h.04c.36-.68 1.23-1.39 2.53-1.39 2.7 0 3.2 1.78 3.2 4.1v4.78z" />
  </svg>
)
const IconGitHub = (p) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...p}>
    <path d="M12 .3a12 12 0 00-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.4-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-6 0-1.2.5-2.3 1.3-3.1-.2-.4-.6-1.6 0-3.2 0 0 1-.3 3.4 1.2a11.5 11.5 0 016 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.9.1 3.2a4.5 4.5 0 011.3 3.1c0 4.6-2.9 5.6-5.5 5.9.5.4.9 1.1.9 2.3v3.3c0 .3.1.7.8.6A12 12 0 0012 .3" />
  </svg>
)

// Full-screen mobile overlay. Backdrop blur + dark gradient, big gradient
// text for each link with stagger entry, social footer at the bottom.
function MobileOverlay({ open, onClose, active, setActive }) {
  // Lock body scroll while open — same trick used in ProjectDrawer.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          key="overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-30 sm:hidden flex flex-col justify-between px-6 pt-24 pb-10"
          style={{
            background:
              'radial-gradient(120% 80% at 50% 0%, rgba(145, 94, 255, 0.35) 0%, rgba(10, 4, 24, 0.85) 45%, rgba(5, 2, 17, 0.98) 100%)',
            backdropFilter: 'blur(14px)',
            WebkitBackdropFilter: 'blur(14px)',
          }}
        >
          {/* Centered links */}
          <ul className="list-none flex flex-col items-center gap-8 mt-12">
            {navLinks.map((link, i) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              >
                <a
                  href={`#${link.id}`}
                  onClick={() => {
                    playClick()
                    setActive(link.title)
                    onClose()
                  }}
                  className="text-5xl font-black tracking-tight bg-gradient-to-br from-white via-pink-300 to-purple-400 bg-clip-text text-transparent hover:scale-105 transition-transform inline-block"
                >
                  {link.title}
                </a>
              </motion.li>
            ))}
          </ul>

          {/* Footer with social links */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-4"
          >
            <div className="h-px w-16 bg-white/15" />
            <div className="flex items-center gap-6">
              <a
                href={`mailto:${SOCIAL.email}`}
                aria-label="Envoyer un email"
                onClick={() => playClick()}
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-pink-300 hover:bg-white/10 transition-colors"
              >
                <IconMail width="18" height="18" />
              </a>
              <a
                href={SOCIAL.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                onClick={() => playClick()}
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-[#915EFF] hover:bg-white/10 transition-colors"
              >
                <IconLinkedIn width="20" height="20" />
              </a>
              <a
                href={SOCIAL.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                onClick={() => playClick()}
                className="w-11 h-11 rounded-full border border-white/15 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
              >
                <IconGitHub width="20" height="20" />
              </a>
            </div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-white/40 mt-2">
              Réponse sous 24h
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

const Navbar = () => {
  const [active, setActive] = useState('')
  const [toggle, setToggle] = useState(false)

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-40 bg-primary`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive('')
            setToggle(false)
            window.scrollTo(0, 0)
          }}
        >
          <img src={kitsune} alt="logo" className="w-9 h-9 object-contain" />
          <p className="text-white text-[18px] font-bold cursor-pointer whitespace-nowrap">
            Hugo
            <span className="hidden sm:inline">&nbsp;| AI Product Engineer</span>
            <span className="hidden lg:inline">&nbsp;| Full-Stack &amp; Mobile</span>
            <span className="hidden xl:inline">&nbsp;| Automation &amp; AI Agents</span>
          </p>
        </Link>

        <div className="flex items-center gap-3">
          <SoundToggle />

          <ul className="list-none hidden sm:flex flex-row gap-10">
            {navLinks.map((link) => (
              <li
                key={link.id}
                className={`${
                  active === link.title ? 'text-white' : 'text-secondary'
                }
                  hover:text-white text-[18px] font-medium cursor-pointer`}
                onClick={() => setActive(link.title)}
              >
                <a href={`#${link.id}`}>{link.title}</a>
              </li>
            ))}
          </ul>

          {/* Mobile burger — sits ABOVE the overlay (z-40 on nav, z-30 on
              overlay) so the user can tap it again to close. */}
          <button
            type="button"
            onClick={() => {
              playClick()
              setToggle((t) => !t)
            }}
            aria-label={toggle ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={toggle}
            className="sm:hidden w-10 h-10 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <BurgerIcon open={toggle} />
          </button>

          <MobileOverlay
            open={toggle}
            onClose={() => setToggle(false)}
            active={active}
            setActive={setActive}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
