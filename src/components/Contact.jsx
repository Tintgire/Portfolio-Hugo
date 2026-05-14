import React, { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import emailjs from '@emailjs/browser'

import { styles } from '../styles'
import { EarthCanvas } from './canvas'
import { SectionWrapper } from '../hoc'
import { slideIn } from '../utils/motion'
import { playSubmit } from '../lib/audio/uiSounds'

const Contact = () => {
  const formRef = useRef()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)

    emailjs
      .send(
        'service_orlgp6g',
        'template_f75y83m',
        {
          from_name: form.name,
          to_name: '',
          from_email: form.email,
          to_email: '',
          message: form.message,
        },
        'uivf8EyNaRYPeWLa_'
      )
      .then(
        () => {
          setLoading(false)
          playSubmit()
          alert('Merci pour le message😎😎')

          setForm({
            name: '',
            email: '',
            message: '',
          })
        },
        (error) => {
          setLoading(false)
          console.log(error)
          alert(`Quelque chose s'est mal passé...`)
        }
      )
  }

  return (
    <div className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn('left', 'tween', 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Entrer en Contact</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mt-12 flex flex-col gap-8"
        >
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Ton Nom</span>
            <input
              type="text"
              name="name"
              placeholder="Quel est ton Nom?"
              onChange={handleChange}
              value={form.name}
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white 
                rounded-lg outlined-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Ton Email</span>
            <input
              type="text"
              name="email"
              placeholder="Quel est ton Email?"
              onChange={handleChange}
              value={form.email}
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white 
                rounded-lg outlined-none border-none font-medium"
            />
          </label>
          <label className="flex flex-col">
            <span className="text-white font-medium mb-4">Ton Message</span>
            <textarea
              name="message"
              placeholder="Quel est ton message?"
              rows={7}
              onChange={handleChange}
              value={form.message}
              className="bg-tertiary py-4 px-6 placeholder:text-secondary text-white 
                rounded-lg outlined-none border-none font-medium"
            ></textarea>
          </label>

          <button
            type="submit"
            className="bg-tertiary py-3 px-8 outline-none w-fit text-white font-bold 
            shadow-md shadow-primary rounded-xl"
          >
            {loading ? 'En cours...' : 'Envoie'}
          </button>
        </form>
      </motion.div>

      <motion.div
        variants={slideIn('right', 'tween', 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <EarthCanvas />
      </motion.div>
    </div>
  )
}

export default SectionWrapper(Contact, 'contact')
