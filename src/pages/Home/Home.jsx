import React from 'react'

import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  DownloadSection,
} from '../../components'
import MusicScrollDriver from '../../lib/MusicScrollDriver'
import SoundPrompt from '../../components/SoundPrompt'

export default function Home() {
  return (
    <div className="realtive z-0 bg-primary">
      <MusicScrollDriver />
      <SoundPrompt />
      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
        <Navbar />
        <Hero />
      </div>

      <About />
      <Experience />
      <DownloadSection />
      <Tech />
      <Works />
      <Feedbacks />

      <div className="relative z-0">
        <Contact />
        <StarsCanvas />
      </div>
    </div>
  )
}
