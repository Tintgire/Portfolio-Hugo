import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import emailjs from '@emailjs/browser'

import { styles } from '../styles'
import { EarthCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { slideIn } from '../utils/motion'
import { playSubmit, playClick } from '../lib/audio/uiSounds'

// Update these if LinkedIn URL changes — the rest of the contacts strip pulls
// from here too so there's a single source of truth for social links.
const SOCIAL = {
  email: 'boidinhugo14@gmail.com',
  github: 'https://github.com/Tintgire',
  linkedin: 'https://www.linkedin.com/in/hugoboidin/',
}

const SUBJECT_CHIPS = [
  'Recrutement',
  'Projet freelance',
  'Collab',
  'Autre',
]

// Per-step config: which field, what prompt, validator, input type
const STEPS = [
  {
    field: 'name',
    title: (form) => 'Salut, comment tu t\'appelles ?',
    hint: 'Prénom suffit.',
    type: 'text',
    placeholder: 'Hugo',
    validate: (v) => v.trim().length >= 2 || 'Au moins 2 caractères.',
  },
  {
    field: 'email',
    title: (form) => `Enchanté ${form.name.split(' ')[0] || ''}, comment je peux te joindre ?`,
    hint: 'Promis, pas de spam.',
    type: 'email',
    placeholder: 'ton@email.com',
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Email invalide.',
  },
  {
    field: 'message',
    title: () => 'Raconte-moi !',
    hint: 'Choisis un sujet (optionnel) et écris-moi ton message.',
    type: 'composite',
    validate: (v) => v.trim().length >= 10 || 'Au moins 10 caractères, sinon je peux pas faire grand chose.',
  },
]

// Small icon helpers — line-style, currentColor so they inherit text color.
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
const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
)
const IconCheck = (p) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" {...p}>
    <path d="M4 12l5 5 11-13" />
  </svg>
)

const Contact = () => {
  const formRef = useRef()
  const inputRef = useRef()
  const isFirstRender = useRef(true)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [direction, setDirection] = useState(1) // 1 = forward (slides in from right), -1 = back
  const [error, setError] = useState(null)
  const [status, setStatus] = useState('idle') // idle | sending | success | error
  const [emailCopied, setEmailCopied] = useState(false)

  const currentStep = STEPS[step]
  const isLastStep = step === STEPS.length - 1

  // Auto-focus the input on step change. Skip the very first render so the
  // page doesn't auto-scroll to the contact form on initial page load (which
  // is what happens when you focus an off-screen element). `preventScroll`
  // is a belt-and-braces guard for subsequent step changes.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const t = setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 350)
    return () => clearTimeout(t)
  }, [step])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(SOCIAL.email)
      playClick()
      setEmailCopied(true)
      setTimeout(() => setEmailCopied(false), 2000)
    } catch (err) {
      console.error('Clipboard copy failed:', err)
    }
  }

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }))
    if (error) setError(null)
  }

  const goNext = () => {
    const value = form[currentStep.field]
    const valid = currentStep.validate(value)
    if (valid !== true) {
      setError(valid)
      return
    }
    playClick()
    setError(null)
    if (isLastStep) {
      submit()
    } else {
      setDirection(1)
      setStep((s) => s + 1)
    }
  }

  const goBack = () => {
    if (step === 0) return
    playClick()
    setError(null)
    setDirection(-1)
    setStep((s) => s - 1)
  }

  const handleKeyDown = (e) => {
    // Enter advances (except in textarea where Enter inserts a newline;
    // Cmd/Ctrl+Enter submits from textarea)
    if (e.key === 'Enter') {
      if (currentStep.type === 'composite' && !(e.metaKey || e.ctrlKey)) return
      e.preventDefault()
      goNext()
    }
  }

  const submit = () => {
    // EmailJS credentials live in env vars so we never commit them. Local dev
    // reads from .env.local; prod reads from Vercel's environment settings.
    const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error('EmailJS env vars missing — set VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, VITE_EMAILJS_PUBLIC_KEY')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
      return
    }

    setStatus('sending')

    const messageWithSubject = form.subject
      ? `[Sujet : ${form.subject}]\n\n${form.message}`
      : form.message

    emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      {
        from_name: form.name,
        to_name: 'Hugo',
        from_email: form.email,
        to_email: 'boidinhugo14@gmail.com',
        message: messageWithSubject,
      },
      PUBLIC_KEY,
    ).then(
      () => {
        playSubmit()
        setStatus('success')
        // After 4s, reset to step 0 with empty form so it can be reused
        setTimeout(() => {
          setForm({ name: '', email: '', subject: '', message: '' })
          setStep(0)
          setStatus('idle')
        }, 4000)
      },
      (err) => {
        console.error(err)
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
      },
    )
  }

  return (
    <div className="xl:mt-12 flex flex-col gap-6 overflow-hidden">
      <div className="xl:flex-row flex-col-reverse flex gap-10">
        {/* LEFT — conversational form */}
        <motion.div
          variants={slideIn('left', 'tween', 0.2, 1)}
          className="flex-[0.75] bg-black-100 p-8 sm:p-10 rounded-2xl flex flex-col"
        >
          <p className={styles.sectionSubText}>Entrer en contact</p>
          <h3 className={styles.sectionHeadText}>Contact.</h3>

          {status === 'success' ? (
            <SuccessState name={form.name} />
          ) : (
            <form
              ref={formRef}
              onSubmit={(e) => { e.preventDefault(); goNext() }}
              className="mt-10 flex-1 flex flex-col"
            >
              {/* Step counter */}
              <p className="text-[10px] tracking-[0.3em] uppercase text-purple-300/70 mb-3">
                {String(step + 1).padStart(2, '0')} / {String(STEPS.length).padStart(2, '0')}
              </p>

              {/* Animated step content. Plain motion.div with `key={step}`
                  re-mounts on each step change — React handles the unmount/
                  remount, framer-motion plays the entrance animation. We
                  intentionally don't use AnimatePresence here because its
                  mode="wait" was leaving the previous step's content stuck
                  in the DOM in some renders. */}
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  // min-h locks the step content area to a stable size so the
                  // form column (and the Earth canvas mirroring its height
                  // with xl:h-auto) doesn't grow when step 3 introduces the
                  // chips + textarea. Measured: step 3 natural height ~292px,
                  // we round up to 320 for a comfortable buffer.
                  className="flex-1 flex flex-col min-h-[320px]"
                >
                  <h4 className="text-white text-2xl sm:text-3xl font-bold leading-tight mb-2">
                    {currentStep.title(form)}
                  </h4>
                  <p className="text-secondary text-sm mb-6">{currentStep.hint}</p>

                  {currentStep.type === 'composite' ? (
                    <>
                      {/* Subject chips (optional) */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        {SUBJECT_CHIPS.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => { playClick(); setField('subject', form.subject === s ? '' : s) }}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                              form.subject === s
                                ? 'bg-purple-500/30 border-purple-400 text-white'
                                : 'bg-purple-500/5 border-purple-400/25 text-purple-200 hover:border-purple-400/60'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                      <textarea
                        ref={inputRef}
                        name="message"
                        rows={5}
                        placeholder="Dis-moi ce que tu as en tête… (Cmd+Entrée pour envoyer)"
                        value={form.message}
                        onChange={(e) => setField('message', e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={status === 'sending'}
                        className="w-full bg-tertiary py-4 px-5 placeholder:text-secondary/60 text-white rounded-lg border border-white/10 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all resize-none disabled:opacity-50"
                      />
                    </>
                  ) : (
                    <input
                      ref={inputRef}
                      type={currentStep.type}
                      name={currentStep.field}
                      placeholder={currentStep.placeholder}
                      value={form[currentStep.field]}
                      onChange={(e) => setField(currentStep.field, e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={status === 'sending'}
                      autoComplete={currentStep.field === 'email' ? 'email' : 'off'}
                      className="w-full bg-transparent border-0 border-b-2 border-white/15 focus:border-pink-500 focus:outline-none text-white text-2xl sm:text-3xl font-light py-3 placeholder:text-white/20 transition-colors disabled:opacity-50"
                    />
                  )}

                  {/* Inline error */}
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="mt-3 text-xs text-rose-300"
                      >
                        ⚠ {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

              {/* Footer: back / next / progress */}
              <div className="mt-8 flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={goBack}
                  disabled={step === 0 || status === 'sending'}
                  className="text-xs text-white/55 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/30 hover:scale-[1.03] transition-transform disabled:opacity-60 disabled:hover:scale-100"
                >
                  {status === 'sending'
                    ? <>Envoi en cours…</>
                    : isLastStep
                      ? <>Envoyer le message <IconArrowRight width="14" height="14" /></>
                      : <>Suivant <IconArrowRight width="14" height="14" /></>}
                </button>
              </div>

              {/* Progress dots */}
              <div className="mt-6 flex gap-1.5">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-[3px] flex-1 rounded-full transition-all ${
                      i <= step ? 'bg-gradient-to-r from-pink-500 to-purple-500' : 'bg-white/10'
                    }`}
                  />
                ))}
              </div>

              {/* Error toast (network failure) */}
              <AnimatePresence>
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 px-4 py-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-200 text-xs"
                  >
                    Hmm, ça n'est pas parti. Réessaie ou écris-moi directement à {SOCIAL.email}.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          )}
        </motion.div>

        {/* RIGHT — Earth 3D (preserved) */}
        <motion.div
          variants={slideIn('right', 'tween', 0.2, 1)}
          className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
        >
          <EarthCanvas />
        </motion.div>
      </div>

      {/* BOTTOM — direct contacts strip */}
      <ContactsStrip onCopyEmail={copyEmail} emailCopied={emailCopied} />
    </div>
  )
}

// Success state shown after the email is sent. Replaces the form briefly.
const SuccessState = ({ name }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="mt-10 flex-1 flex flex-col items-center justify-center text-center"
  >
    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/40">
      <IconCheck width="32" height="32" className="text-white" />
    </div>
    <h4 className="text-white text-2xl font-bold mb-2">Merci {name.split(' ')[0]} !</h4>
    <p className="text-secondary text-sm max-w-sm">
      Ton message est parti. Je te réponds sous 24h, promis.
    </p>
  </motion.div>
)

// Direct contacts strip displayed below the form + Earth. Horizontal on lg,
// stacks on smaller viewports. Email click copies to clipboard rather than
// firing a mailto: — more universal (no email client required).
const ContactsStrip = ({ onCopyEmail, emailCopied }) => (
  <motion.div
    variants={slideIn('up', 'tween', 0.4, 0.8)}
    className="bg-gradient-to-br from-[#160a30] to-[#0a0418] border border-white/10 rounded-2xl px-6 py-4 flex flex-col lg:flex-row items-start lg:items-center gap-4 lg:gap-6"
  >
    <span className="text-[10px] tracking-[0.3em] uppercase text-purple-300/70 shrink-0">
      Plus direct ?
    </span>
    <div className="flex-1 flex flex-wrap items-center gap-x-6 gap-y-2">
      <button
        type="button"
        onClick={onCopyEmail}
        title="Cliquer pour copier l'email"
        className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors group cursor-pointer"
      >
        <IconMail width="16" height="16" className="text-pink-400 group-hover:text-pink-300" />
        <span className="relative">
          {emailCopied ? (
            <span className="text-emerald-300 inline-flex items-center gap-1.5">
              <IconCheck width="14" height="14" /> Copié !
            </span>
          ) : (
            SOCIAL.email
          )}
        </span>
      </button>
      <a
        href={SOCIAL.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors group"
      >
        <IconLinkedIn width="16" height="16" className="text-[#915EFF] group-hover:text-purple-300" />
        LinkedIn
      </a>
      <a
        href={SOCIAL.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-white/85 hover:text-white transition-colors group"
      >
        <IconGitHub width="16" height="16" className="text-white/85 group-hover:text-white" />
        GitHub
      </a>
    </div>
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/35 text-emerald-300 text-xs shrink-0">
      <span className="relative flex w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75" />
        <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
      </span>
      Réponse sous 24h
    </div>
  </motion.div>
)

export default SectionWrapper(Contact, 'contact')
