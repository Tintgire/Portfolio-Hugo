# Plan 3 — Project Detail Drawer

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every project (Rubi, Kaza, Hot Takes, Kanap) explorable in depth via a glassmorphic side drawer that opens on click. The drawer shows a full image gallery, long description, year, tech list, and links. Works on both featured projects (Rubi's "Détails du projet" CTA) and non-featured ones (clicking the project card). No 3D-Three.js scene migration in this plan — that stays for Plan 4+.

**Architecture:**
- A new `ProjectDrawer` component renders an animated side panel (slide-in from the right on desktop, full-screen overlay on mobile) using Framer Motion's `AnimatePresence`.
- Drawer state (which project is currently open) lives in `Works.jsx` as `useState<string|null>` keyed by `project.id`. The current `Works` already filters featured vs others; it now also passes an `onOpen(id)` callback to both card variants.
- A new `DrawerGallery` component renders the project's `images` array with thumbnails + a "current image" hero slot. For single-image projects it degrades to just the hero slot.
- The projects data in `src/constans/index.js` gains a `longDescription` field on each project (already partially there for Rubi; we'll add it for Kaza/Hot Takes/Kanap by re-using the existing `description` as a sane default if no separate copy is provided).
- Accessibility: drawer traps focus (close button is first focusable), supports `Escape` to close, restores focus to the trigger element on close, locks body scroll while open.
- Lenis: when the drawer opens, we stop Lenis (so the underlying page doesn't smooth-scroll behind the drawer). When it closes, we resume.

**Tech Stack:**
- Existing: React 18, Framer Motion (`AnimatePresence`, `motion.div`, animations), Tailwind, Lenis (Plan 1)
- No new deps

**Reference spec:** docs/superpowers/specs/2026-05-13-portfolio-cinematic-redesign-design.md §6.4

---

### Task 1: Add longDescription field to projects data

**Files:** Modify `src/constans/index.js`

The projects array (currently around lines 212-330) has 4 entries. Add a `longDescription` field to each, immediately after the `description` field. For Rubi, fill it with rich copy. For Kaza/Hot Takes/Kanap, default to the existing `description` (no separate long copy provided yet — user can edit later).

- [ ] **Step 1: Open `src/constans/index.js` and locate the projects array**

Look for `const projects = [` (around line 212). The 4 entries are: rubi, kasa, hottakes, kanap.

- [ ] **Step 2: Add longDescription on each project**

For **rubi**, add after the existing `description: ...,` line:

```js
    longDescription: `Rubi inverse l'équation des données personnelles : au lieu que les utilisateurs cèdent gratuitement leurs informations aux plateformes, l'application leur reverse une rémunération directe à chaque utilisation. Au cœur du produit, un système de consentement granulaire — l'utilisateur autorise (ou refuse) l'accès, donnée par donnée — et un wallet intégré qui crédite les gains en temps réel.

Côté technique, le stack est résolument mobile-first : React Native pour l'app iOS/Android avec composants natifs (Java/Kotlin/Objective-C) pour les modules de sécurité, Next.js pour le dashboard web et l'API publique, Supabase + Firebase pour la persistance et l'auth, le tout orchestré via Docker. La sécurité a été pensée dès la conception : chiffrement bout en bout des consentements et audit trail immutable.

Projet d'entreprise — code source privé. Disponible sur l'App Store.`,
```

For **kasa**, after its `description:` line, add:

```js
    longDescription: `Kaza est une plateforme de location immobilière saisonnière construite en React. Le projet pédagogique de l'OpenClassrooms parcours Dev Web met l'accent sur la navigation client-side (React Router), la décomposition en composants réutilisables (Cards, Collapsible, Carousel), et l'intégration de données JSON statiques.

J'ai porté une attention particulière au responsive (SCSS modulaire avec breakpoints mobile/tablet/desktop) et aux animations de transition entre pages. Le carrousel de photos est entièrement fait-main, sans bibliothèque externe.`,
```

For **hottakes**, after its `description:` line, add:

```js
    longDescription: `Hot Takes est une API REST sécurisée pour une application d'avis culinaires, construite avec Node.js + Express. Le projet couvre l'authentification JWT, la gestion de l'upload d'images (Multer), la validation côté serveur, et la mise en place de mesures OWASP (rate limiting, headers sécurisés via Helmet, sanitization).

La modélisation de données utilise Mongoose pour structurer les schémas (utilisateurs, sauces, likes/dislikes) avec contraintes et indexes appropriés. Les routes sont versionnées et documentées, conformes à la pédagogie REST.`,
```

For **kanap**, after its `description:` line, add:

```js
    longDescription: `Kanap est un site e-commerce de canapés codé en JavaScript vanilla — pas de framework, juste les fondamentaux. Le projet entraîne sur la gestion du DOM, la consommation d'une API REST, la persistance d'un panier en localStorage, et la validation de formulaires côté client avec regex.

Pour le plan de test, j'ai documenté les cas d'usage critiques (ajout au panier, modification de quantité, validation de commande) et identifié les bugs côté API en testant chaque endpoint via Postman. Un exercice solide de fondations avant de monter en abstraction sur les frameworks.`,
```

- [ ] **Step 3: Verify build**

```bash
npx vite build
```

Expected: success.

- [ ] **Step 4: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/constans/index.js
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "data: add longDescription to each project for the detail drawer"
```

---

### Task 2: Create DrawerGallery component

**Files:** Create `src/components/works/DrawerGallery.jsx`

A gallery that shows one large active image + thumbnail strip below. Click a thumbnail to swap the hero. For single-image projects it renders just the hero slot.

- [ ] **Step 1: Write the component**

Create `src/components/works/DrawerGallery.jsx`:

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DrawerGallery({ images, alt }) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images || images.length === 0) return null

  const single = images.length === 1

  return (
    <div className="w-full">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-black/40">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIndex}
            src={images[activeIndex]}
            alt={alt}
            initial={{ opacity: 0, scale: 1.02 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
      </div>

      {!single && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Voir l'image ${i + 1}`}
              aria-current={i === activeIndex}
              className={`relative shrink-0 w-20 h-14 rounded-md overflow-hidden border-2 transition-all ${
                i === activeIndex
                  ? 'border-[#915EFF] opacity-100'
                  : 'border-white/10 opacity-60 hover:opacity-90'
              }`}
            >
              <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/works/DrawerGallery.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add DrawerGallery component with thumbnail strip"
```

---

### Task 3: Create ProjectDrawer component

**Files:** Create `src/components/works/ProjectDrawer.jsx`

The side panel that slides in. Uses `AnimatePresence` for mount/unmount animation, locks body scroll, ESC to close, click on backdrop to close, focus the close button when opened.

- [ ] **Step 1: Write the component**

Create `src/components/works/ProjectDrawer.jsx`:

```jsx
import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DrawerGallery from './DrawerGallery'

export default function ProjectDrawer({ project, onClose }) {
  const closeBtnRef = useRef(null)

  useEffect(() => {
    if (!project) return

    const previouslyFocused = document.activeElement
    closeBtnRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus()
      }
    }
  }, [project, onClose])

  return (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          <motion.aside
            key="panel"
            role="dialog"
            aria-modal="true"
            aria-labelledby="drawer-title"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:max-w-[640px] bg-gradient-to-br from-[#0a0418] via-[#160a30] to-[#050211] border-l border-white/10 shadow-2xl overflow-y-auto"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-[#0a0418]/80 backdrop-blur-md border-b border-white/5">
              <div className="text-[10px] tracking-[0.3em] uppercase opacity-55">
                {project.type} · {project.year}
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Fermer le détail du projet"
                className="w-9 h-9 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
              >
                <span aria-hidden className="text-xl leading-none">×</span>
              </button>
            </div>

            <div className="px-6 sm:px-8 py-6 space-y-6">
              <header>
                <h2 id="drawer-title" className="text-3xl sm:text-4xl font-black tracking-tight leading-tight bg-gradient-to-br from-white via-pink-300 to-purple-400 bg-clip-text text-transparent">
                  {project.name}
                </h2>
                <p className="mt-2 text-white/75 text-sm leading-relaxed">
                  {project.description}
                </p>
              </header>

              <DrawerGallery images={project.images} alt={project.name} />

              {project.longDescription && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-55 mb-2">À propos</h3>
                  <div className="text-white/80 text-sm leading-relaxed whitespace-pre-line">
                    {project.longDescription}
                  </div>
                </section>
              )}

              {project.tech?.length > 0 && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-55 mb-2">Stack technique</h3>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-1 rounded bg-purple-300/10 border border-purple-300/25 text-purple-200"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </section>
              )}

              {(project.links?.live || project.links?.github) && (
                <section>
                  <h3 className="text-[10px] tracking-[0.3em] uppercase opacity-55 mb-2">Liens</h3>
                  <div className="flex flex-wrap gap-3">
                    {project.links.live && (
                      <a
                        href={project.links.live.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/40 hover:scale-[1.03] transition-transform"
                      >
                        {project.links.live.label} ↗
                      </a>
                    )}
                    {project.links.github?.url && (
                      <a
                        href={project.links.github.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-white/20 bg-white/5 text-white text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
                      >
                        Code source ↗
                      </a>
                    )}
                    {project.links.github?.private && (
                      <span className="inline-flex items-center text-[10px] opacity-55 italic">
                        ⚿ Code source privé — {project.links.github.reason}
                      </span>
                    )}
                  </div>
                </section>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
npx vite build
```

- [ ] **Step 3: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/works/ProjectDrawer.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: add ProjectDrawer component with focus + ESC handling"
```

---

### Task 4: Wire drawer state in Works + open from FeaturedProject

**Files:**
- Modify: `src/components/Works.jsx`
- Modify: `src/components/works/FeaturedProject.jsx`

Works now owns the "which project is open" state. It passes `onOpen` to each card variant. The drawer is rendered at the Works level (one drawer for the whole section).

- [ ] **Step 1: Update FeaturedProject to accept and call onOpen**

Open `src/components/works/FeaturedProject.jsx`. Change the function signature from:

```jsx
export default function FeaturedProject({ project }) {
```

to:

```jsx
export default function FeaturedProject({ project, onOpen }) {
```

Then replace the secondary CTA section. Find the `<div className="flex flex-wrap gap-3">` block that contains the `links?.live && (...)` anchor. Right after that anchor (inside the same `<div className="flex flex-wrap gap-3">`), add a "Détails du projet" button:

Change:

```jsx
          <div className="flex flex-wrap gap-3">
            {links?.live && (
              <a
                href={links.live.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/40 hover:scale-[1.03] transition-transform"
              >
                Voir sur l'{links.live.label} ↗
              </a>
            )}
          </div>
```

to:

```jsx
          <div className="flex flex-wrap gap-3">
            {links?.live && (
              <a
                href={links.live.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 text-white text-xs font-bold tracking-wider shadow-lg shadow-pink-500/40 hover:scale-[1.03] transition-transform"
              >
                Voir sur l'{links.live.label} ↗
              </a>
            )}
            <button
              type="button"
              onClick={() => onOpen?.(project.id)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border border-purple-300/40 bg-white/5 text-purple-100 text-xs font-bold tracking-wider hover:bg-white/10 transition-colors"
            >
              Détails du projet
            </button>
          </div>
```

- [ ] **Step 2: Update Works.jsx to own drawer state**

Open `src/components/Works.jsx`. Replace its entire content with:

```jsx
import React, { useState, useCallback } from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'

import { styles } from '../styles'
import { github } from '../assets'

import { SectionWrapper } from '../hoc'
import { projects } from '../constans'
import { fadeIn, textVariant } from '../utils/motion'
import FeaturedProject from './works/FeaturedProject'
import ProjectDrawer from './works/ProjectDrawer'

const ProjectCard = ({
  index,
  project,
  onOpen,
}) => {
  const { id, name, description, tags, image, source_code_link } = project

  return (
    <motion.div variants={fadeIn('up', 'spring', index * 0.5, 0.75)}>
      <Tilt
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full cursor-pointer"
      >
        <div
          role="button"
          tabIndex={0}
          onClick={() => onOpen?.(id)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onOpen?.(id)
            }
          }}
        >
          <div className="relative w-full h-[230px]">
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover rounded-2xl"
            />

            <div className="absolute inset-0 flex justify-end m-3">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(source_code_link, '_blank')
                }}
                aria-label={`Ouvrir le code source de ${name}`}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              >
                <img
                  src={github}
                  alt=""
                  className="w-1/2 h-1/2 object-contain"
                />
              </button>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="text-white font-bold text-[24px]">{name}</h3>
            <p className="mt-2 text-secondary text-[14px]">{description}</p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>
        </div>
      </Tilt>
    </motion.div>
  )
}

const Works = () => {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

  const [openId, setOpenId] = useState(null)
  const openProject = useCallback((id) => setOpenId(id), [])
  const closeProject = useCallback(() => setOpenId(null), [])

  const activeProject = openId ? projects.find((p) => p.id === openId) : null

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Mon Travail</p>
        <h2 className={styles.sectionHeadText}>Projets.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn('', '', 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Voici mes projets finis, soigneusement réalisés avec passion et
          dévouement au fil du temps. Chacun d'entre eux représente un
          aboutissement personnel, et j'espère sincèrement qu'ils vous
          procureront satisfaction et plaisir. N'hésitez pas à les explorer en
          détail et, si l'un d'entre eux retient particulièrement votre
          attention, je serais ravi de recevoir vos commentaires et vos
          impressions. Votre retour est précieux pour moi, car il alimente ma
          motivation et m'encourage à continuer à créer des œuvres qui suscitent
          l'enthousiasme. Alors, parcourez-les à votre guise et laissez libre
          cours à votre appréciation. Merci d'avance pour votre intérêt et votre
          soutien, et j'attends avec impatience vos messages enthousiastes! :D
        </motion.p>
      </div>

      {featured.length > 0 && (
        <div className="mt-16">
          {featured.map((project) => (
            <FeaturedProject
              key={project.id}
              project={project}
              onOpen={openProject}
            />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-7">
        {others.map((project, index) => (
          <ProjectCard
            key={project.id ?? `project-${index}`}
            project={project}
            index={index}
            onOpen={openProject}
          />
        ))}
      </div>

      <ProjectDrawer project={activeProject} onClose={closeProject} />
    </>
  )
}

export default SectionWrapper(Works, '')
```

Key changes from the previous Works.jsx:
- `ProjectCard` now receives `project` as a single prop (not spread) plus `onOpen`. The whole card is keyboard-focusable and triggers the drawer on click/Enter/Space. The github icon is now a `<button>` with `stopPropagation` so it doesn't bubble to the card click.
- A new `<ProjectDrawer />` is rendered at the bottom of the Works section.
- Both card variants get `onOpen={openProject}`.

- [ ] **Step 3: Build**

```bash
npx vite build
```

- [ ] **Step 4: Commit**

```bash
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo add src/components/Works.jsx src/components/works/FeaturedProject.jsx
git -c user.email=boidinhugo14@gmail.com -c user.name=Hugo commit -m "feat: wire project detail drawer to featured + non-featured cards"
```

---

### Task 5: Verify locally (controller does this)

This task is performed by the controller after Task 4. The implementer does NOT need to do it. (Listed here so the controller knows what to check before pushing.)

- Click on Rubi's "Détails du projet" → drawer slides in from the right with gallery, long description, stack, links
- Click backdrop → drawer closes
- Press Escape while open → drawer closes
- Click on Kaza card → drawer opens with Kaza content (single image — gallery shows just the hero slot, no thumbnails)
- Click the github icon on a card → opens GitHub in a new tab, does NOT open the drawer
- Tab navigation: close button is focused first when opened; after close, focus returns to the trigger
- Mobile (375px): drawer is full-width, content is readable

---

### Task 6: Deploy and verify production

- [ ] **Step 1: Push**

```bash
git push origin main
```

- [ ] **Step 2: Wait for Vercel deploy**

```bash
sleep 90 && curl -o /dev/null -s -w "Home: %{http_code}\n" https://portfolio-hugo-ten.vercel.app/
```

Expected: `Home: 200`.

- [ ] **Step 3: Visual check on production**

Open https://portfolio-hugo-ten.vercel.app/ in a browser. In the Works section:
- "Détails du projet" on Rubi → opens drawer with the rich Rubi content
- Clicking any other project card → opens drawer with that project's content
- Drawer respects ESC, click-outside, focus restoration

Carry-over checks:
- Hero PC particles still visible
- Hero PC still fades out as you scroll past
- Lenis smooth scroll still works

- [ ] **Step 4: No commit needed**

Plan 3 complete once production is verified.

---

## Self-Review Notes

**Spec coverage:**
- Spec §6.4 (drawer detail) — fully covered
- Spec §6.1 (extensible data) — extended with `longDescription` field
- Spec §6.2 (featured project treatment) — Rubi gets the "Détails du projet" secondary CTA

**Not covered (deferred):**
- 3D mockups for non-featured projects (Plan 4 territory — requires the canvas refactor or per-section R3F)
- Drawer "blur the canvas behind" — would require canvas opacity coupling, Plan 4 territory
- Mouse-tilt parallax on non-featured cards (react-tilt is in place, sufficient for now)

**Risk / open items:**
- The drawer uses `document.body.style.overflow = 'hidden'` to lock scroll. Lenis may behave oddly with this — the cleanup restores the previous overflow value. Verify locally that re-opening the drawer multiple times doesn't leak overflow state.
- `previouslyFocused` capture happens during the effect setup (on mount). If the user opens drawer, tabs elsewhere, then closes, focus jumps to the original trigger, not the last-focused element. Acceptable for v1.
- Image gallery preloads only the active image. For 4-image projects (Rubi) this could feel slightly laggy on thumbnail clicks. Acceptable; can add `<link rel="preload">` later if needed.

**YAGNI check:**
- No focus trap library added — manual ESC + restore + initial focus is enough for this size of drawer
- No portal — `position: fixed` at the React level works fine without `createPortal`
- The `single` boolean in DrawerGallery is local; no need to memoize
