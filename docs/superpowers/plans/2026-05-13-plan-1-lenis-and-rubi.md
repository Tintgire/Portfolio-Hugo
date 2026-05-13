# Plan 1 — Lenis Smooth Scroll + Rubi Te Paye Visible

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Lenis smooth scroll globally + integrate Rubi te paye as a featured project in the Works section, without yet refactoring the 3D canvas architecture (left for Plan 2).

**Architecture:**
- Lenis is mounted at the React tree root via a small `LenisProvider` component, providing buttery smooth scroll across the entire site.
- The Works data structure in `src/constans/index.js` is extended (backward compatible) with new fields: `id`, `type` (mobile/web/tool), `featured`, `tech` (string array), `images` (array), `links` (live + github structured). Old fields (`name`, `description`, `tags`, `source_code_link`, `site`) remain so the existing card renderer keeps working.
- The `Works.jsx` component now branches: if a project has `featured: true`, it renders a new dedicated component `FeaturedProject.jsx` (Rubi-style hero with 4-phone CSS parallax layout). Non-featured projects keep the existing `react-tilt` card.
- Rubi screenshots (`Rubi1.png` to `Rubi4.png` currently at project root) move to `public/projects/rubi/screen-1.png` through `screen-4.png` for direct URL access.

**Tech Stack:**
- New runtime dep: `lenis` (v1.x)
- Existing: React 18, Framer Motion, Tailwind, react-tilt, Vite
- No new test infra (Plan 1 relies on manual verification via Vite dev server)

**Reference spec:** `docs/superpowers/specs/2026-05-13-portfolio-cinematic-redesign-design.md`

---

### Task 1: Install Lenis

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Install the lenis package**

Run from `C:\Users\Hugo\Desktop\Portfolio-Hugo`:

```bash
npm install lenis
```

Expected: package added to `dependencies`, `package-lock.json` updated, no errors.

- [ ] **Step 2: Verify Lenis is resolvable**

Run:

```bash
node -e "console.log(require.resolve('lenis'))"
```

Expected: prints a path inside `node_modules/lenis/`.

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "deps: add lenis for smooth scroll"
```

---

### Task 2: Create LenisProvider component

**Files:**
- Create: `src/lib/LenisProvider.jsx`

- [ ] **Step 1: Write the component**

Create `src/lib/LenisProvider.jsx`:

```jsx
import { useEffect } from 'react'
import Lenis from 'lenis'

export default function LenisProvider({ children }) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    })

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
    }
  }, [])

  return children
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/LenisProvider.jsx
git commit -m "feat: add LenisProvider component"
```

---

### Task 3: Mount LenisProvider at the React root

**Files:**
- Modify: `src/index.jsx`

- [ ] **Step 1: Read current entry file**

Open `src/index.jsx` — verify it matches this (it should):

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 2: Wrap App with LenisProvider**

Replace `src/index.jsx` with:

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import LenisProvider from './lib/LenisProvider.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LenisProvider>
        <App />
      </LenisProvider>
    </BrowserRouter>
  </React.StrictMode>
)
```

- [ ] **Step 3: Verify smooth scroll in dev server**

Start the dev server via the preview tool (name `vite-dev`, config in `.claude/launch.json`), then:

1. Resize viewport to desktop (1280×800)
2. Scroll the page with the wheel
3. Confirm scroll has visible inertia / smoothing (not the default abrupt scroll)
4. Open DevTools console (or use preview_console_logs) — confirm no errors

If scroll feels too slow or too fast, adjust `duration` in `LenisProvider.jsx` (default 1.2; try 1.0 for snappier, 1.6 for slower).

- [ ] **Step 4: Commit**

```bash
git add src/index.jsx
git commit -m "feat: mount LenisProvider at React root"
```

---

### Task 4: Move Rubi screenshots to public/

**Files:**
- Delete: `Rubi1.png`, `Rubi2.png`, `Rubi3.png`, `Rubi4.png` (at project root)
- Create: `public/projects/rubi/screen-1.png` through `screen-4.png`

- [ ] **Step 1: Create the target directory and move the files**

Run (from project root, in bash):

```bash
mkdir -p public/projects/rubi
mv Rubi1.png public/projects/rubi/screen-1.png
mv Rubi2.png public/projects/rubi/screen-2.png
mv Rubi3.png public/projects/rubi/screen-3.png
mv Rubi4.png public/projects/rubi/screen-4.png
```

- [ ] **Step 2: Verify the files exist at the new path**

```bash
ls public/projects/rubi/
```

Expected output: `screen-1.png  screen-2.png  screen-3.png  screen-4.png`

- [ ] **Step 3: Verify they are served by Vite**

Start the dev server (or reuse running one). Then run from another shell:

```bash
curl -o /dev/null -s -w "%{http_code}\n" http://localhost:5173/projects/rubi/screen-1.png
```

Expected: `200`

- [ ] **Step 4: Commit**

```bash
git add public/projects/rubi/
git commit -m "assets: move Rubi screenshots to public/projects/rubi"
```

---

### Task 5: Add Rubi entry and migrate project data structure

**Files:**
- Modify: `src/constans/index.js` (around line 212, the `projects` array)

The new structure adds fields (`id`, `type`, `featured`, `tech`, `images`, `year`, `links`) while preserving existing fields (`name`, `description`, `tags`, `image`, `source_code_link`, `site`) so nothing else breaks.

- [ ] **Step 1: Read current state of the projects array**

Open `src/constans/index.js`, locate the `const projects = [` block (line 212). Note the existing 3 projects: Kaza, Hot Takes, Kanap.

- [ ] **Step 2: Replace the projects array with the new shape**

Replace the entire `const projects = [ ... ]` block (lines ~212 through ~304) with:

```js
const projects = [
  {
    id: 'rubi',
    name: 'Rubi te paye',
    type: 'mobile',
    featured: true,
    year: '2025',
    description: `Application qui vous paie pour qui vous êtes. Contrôle total de vos données, compensation directe à chaque utilisation, sécurité garantie.`,
    tags: [
      { name: `React Native`, color: `text-cyan-400 text-gradient` },
      { name: `Next.js`, color: `text-white text-gradient` },
      { name: `Tailwind`, color: `text-sky-400 text-gradient` },
      { name: `Supabase`, color: `text-green-400 text-gradient` },
      { name: `Firebase`, color: `text-orange-400 text-gradient` },
      { name: `Docker`, color: `text-blue-400 text-gradient` },
    ],
    tech: [
      'React Native', 'Next.js', 'Tailwind', 'Supabase', 'Docker',
      'Firebase', 'Java', 'Ruby', 'Kotlin', 'Objective-C',
      'SCSS', 'JavaScript', 'HTML', 'Shell',
    ],
    image: '/projects/rubi/screen-2.png',
    images: [
      '/projects/rubi/screen-1.png',
      '/projects/rubi/screen-2.png',
      '/projects/rubi/screen-3.png',
      '/projects/rubi/screen-4.png',
    ],
    site: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387',
    source_code_link: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387',
    links: {
      live: { url: 'https://apps.apple.com/us/app/rubi-pays-you/id6720740387', label: 'App Store' },
      github: { private: true, reason: `Projet d'entreprise` },
    },
  },
  {
    id: 'kasa',
    name: `Kaza`,
    type: 'web',
    featured: false,
    year: '2023',
    description: `En utilisant React et Figma, créez une application web de location immobilière en initiant une application avec Create React App, configurant la navigation entre les pages avec React Router, et développant des éléments d'interface de site web grâce à des composants React.`,
    tags: [
      { name: `Html`, color: `text-blue-500 text-gradient` },
      { name: `Css`, color: `text-green-500 text-gradient` },
      { name: `Scss`, color: `text-pink-500 text-gradient` },
      { name: `Javascript`, color: `text-orange-500 text-gradient` },
      { name: `React`, color: `text-indigo-600 text-gradient` },
      { name: `Figma`, color: `text-fuchsia-600 text-gradient` },
    ],
    tech: ['HTML', 'CSS', 'SCSS', 'JavaScript', 'React', 'Figma'],
    image: kasa,
    images: [kasa],
    site: `https://github.com/Tintgire/projet-7-OC`,
    source_code_link: `https://github.com/Tintgire/projet-7-OC`,
    links: {
      live: null,
      github: { url: `https://github.com/Tintgire/projet-7-OC` },
    },
  },
  {
    id: 'hottakes',
    name: `Hot Takes`,
    type: 'web',
    featured: false,
    year: '2023',
    description: `Construisez une API sécurisée pour une application d'avis gastronomiques, implémenter un modèle logique de données conformément à la réglementation, stocker des données de manière sécurisée et garantir la confidentialité des utilisateurs en mettant en place des mesures robustes de protection des données.`,
    tags: [
      { name: `TypeScript`, color: `blue-text-gradient` },
      { name: `Javascript`, color: `text-orange-500 text-gradient` },
      { name: `Express.js`, color: `text-lime-500 text-gradient` },
      { name: `Api Rest`, color: `text-yellow-500 text-gradient` },
      { name: `MongoDB`, color: `text-red-500 text-gradient` },
      { name: `Node.js`, color: `text-purple-500 text-gradient` },
    ],
    tech: ['TypeScript', 'JavaScript', 'Express.js', 'REST API', 'MongoDB', 'Node.js'],
    image: hottakes,
    images: [hottakes],
    site: `https://github.com/Tintgire/Projet-6-OC`,
    source_code_link: `https://github.com/Tintgire/Projet-6-OC`,
    links: {
      live: null,
      github: { url: `https://github.com/Tintgire/Projet-6-OC` },
    },
  },
  {
    id: 'kanap',
    name: `Kanap`,
    type: 'web',
    featured: false,
    year: '2022',
    description: `En construisant un site e-commerce en JavaScript, vous serez en mesure de créer un plan de test pour l'application, de valider les données provenant de sources externes, d'interagir avec un web service à l'aide de JavaScript, et de gérer les événements JavaScript.`,
    tags: [
      { name: `Html`, color: `text-blue-500 text-gradient` },
      { name: `Css`, color: `text-green-500 text-gradient` },
      { name: `Scss`, color: `text-pink-500 text-gradient` },
      { name: `Javascript`, color: `text-orange-500 text-gradient` },
    ],
    tech: ['HTML', 'CSS', 'SCSS', 'JavaScript'],
    image: kanap,
    images: [kanap],
    site: `https://github.com/Tintgire/Projet-5-OC`,
    source_code_link: `https://github.com/Tintgire/Projet-5-OC`,
    links: {
      live: null,
      github: { url: `https://github.com/Tintgire/Projet-5-OC` },
    },
  },
]
```

- [ ] **Step 3: Verify Vite build still works**

Run from project root:

```bash
npx vite build
```

Expected: build succeeds (no parse errors, no missing imports). Note: this rebuilds the `dist/` folder which is in `.gitignore`, so no cleanup needed.

- [ ] **Step 4: Verify projects render in dev server**

Start dev server (or reuse). Navigate to the Works section in the browser. Confirm all 4 projects appear as cards (Rubi will still use the legacy card rendering at this stage — that's fixed in Task 7). No console errors.

- [ ] **Step 5: Commit**

```bash
git add src/constans/index.js
git commit -m "data: add Rubi te paye + migrate projects to extensible structure"
```

---

### Task 6: Create FeaturedProject component (Rubi hero card)

**Files:**
- Create: `src/components/works/FeaturedProject.jsx`

This component renders the "Rubi-style" hero with 4 phone mockups in CSS parallax. No Three.js yet (that comes in Plan 3).

- [ ] **Step 1: Write the component**

The phone rotations use inline `style` (not Tailwind arbitrary values, which don't support 3D rotation natively). Each `PhoneMockup` takes `pos`, `transform`, `opacity`, `z`, `featured` as props.

Create `src/components/works/FeaturedProject.jsx`:

```jsx
import { motion } from 'framer-motion'

export default function FeaturedProject({ project }) {
  const { name, description, tech, images, links, year } = project

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full rounded-3xl overflow-hidden border border-[#915EFF]/25 bg-gradient-to-br from-[#1a0a35] via-[#2a1156] to-[#050211] p-8 sm:p-12 my-8"
    >
      <div className="grid lg:grid-cols-[1fr_420px] gap-10 items-center">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/15 border border-pink-500/40 text-pink-300 text-[10px] tracking-[0.2em] uppercase font-bold mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
            Live on App Store
            <span className="opacity-60 ml-1">· {year}</span>
          </div>
          <h3 className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-3 bg-gradient-to-br from-white via-pink-300 to-purple-400 bg-clip-text text-transparent">
            {name}
          </h3>
          <p className="text-white/85 text-base leading-relaxed mb-5 max-w-2xl">
            {description}
          </p>
          <div className="flex flex-wrap gap-1.5 mb-6 max-w-2xl">
            {tech.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2 py-1 rounded bg-purple-300/10 border border-purple-300/25 text-purple-200"
              >
                {t}
              </span>
            ))}
          </div>
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
          {links?.github?.private && (
            <p className="text-[10px] opacity-55 italic mt-3">
              ⚿ Code source privé — {links.github.reason}
            </p>
          )}
        </div>

        <div className="relative h-[420px] mx-auto lg:mx-0 lg:justify-self-end" style={{ perspective: '1000px' }}>
          <PhoneMockup src={images[3]} pos={{ left: '10%', top: '60px' }} transform={{ rotateY: -20, rotateZ: 8, scale: 0.85 }} opacity={0.85} z={10} />
          <PhoneMockup src={images[2]} pos={{ left: '28%', top: '10px' }} transform={{ rotateY: -15, rotateZ: 4 }} z={20} />
          <PhoneMockup src={images[1]} pos={{ left: '50%', top: '0' }} transform={{ rotateY: 0, rotateZ: 0 }} z={30} featured />
          <PhoneMockup src={images[0]} pos={{ left: '72%', top: '20px' }} transform={{ rotateY: 15, rotateZ: -6 }} z={20} />
        </div>
      </div>

      <div aria-hidden className="absolute -top-20 -right-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl pointer-events-none" />
      <div aria-hidden className="absolute -bottom-20 -left-20 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />
    </motion.article>
  )
}

function PhoneMockup({ src, pos, transform, opacity = 1, z = 1, featured = false }) {
  const transformStr = `rotateY(${transform.rotateY}deg) rotateZ(${transform.rotateZ}deg) scale(${transform.scale ?? 1})`
  return (
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        position: 'absolute',
        left: pos.left,
        top: pos.top,
        transform: transformStr,
        transformStyle: 'preserve-3d',
        opacity,
        zIndex: z,
        width: '130px',
        height: '270px',
      }}
      className={`rounded-[22px] bg-black border-2 ${featured ? 'border-white/30' : 'border-white/15'} overflow-hidden shadow-2xl shadow-black/60`}
    >
      <div className="absolute inset-1 rounded-[18px] overflow-hidden">
        <img src={src} alt="" className="w-full h-full object-cover" />
      </div>
      <div aria-hidden className="absolute inset-0 rounded-[22px] shadow-[inset_0_0_30px_rgba(145,94,255,0.3)] pointer-events-none" />
    </motion.div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/works/FeaturedProject.jsx
git commit -m "feat: add FeaturedProject component for Rubi hero card"
```

---

### Task 7: Wire Works component to render featured projects specially

**Files:**
- Modify: `src/components/Works.jsx`

- [ ] **Step 1: Update Works to branch on `featured`**

Replace the body of the `Works` component (lines 71-104) so that featured projects render via `FeaturedProject` and non-featured ones use the existing `ProjectCard`. Replace `src/components/Works.jsx` entirely with:

```jsx
import React from 'react'
import { Tilt } from 'react-tilt'
import { motion } from 'framer-motion'

import { styles } from '../styles'
import { github } from '../assets'

import { SectionWrapper } from '../hoc'
import { projects } from '../constans'
import { fadeIn, textVariant } from '../utils/motion'
import FeaturedProject from './works/FeaturedProject'

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  site,
}) => {
  return (
    <motion.div variants={fadeIn('up', 'spring', index * 0.5, 0.75)}>
      <a href={site}>
        <Tilt
          options={{
            max: 45,
            scale: 1,
            speed: 450,
          }}
          className="bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full"
        >
          <div className="relative w-full h-[230px]">
            <img
              src={image}
              alt="project"
              className="w-full h-full object-cover rounded-2xl"
            />

            <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
              <div
                onClick={() => window.open(source_code_link, '_blank')}
                className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
              >
                <img
                  src={github}
                  alt="github"
                  className="w-1/2 h-1/2 object-contain"
                />
              </div>
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
        </Tilt>
      </a>
    </motion.div>
  )
}

const Works = () => {
  const featured = projects.filter((p) => p.featured)
  const others = projects.filter((p) => !p.featured)

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
            <FeaturedProject key={project.id} project={project} />
          ))}
        </div>
      )}

      <div className="mt-12 flex flex-wrap gap-7">
        {others.map((project, index) => (
          <ProjectCard key={project.id ?? `project-${index}`} {...project} index={index} />
        ))}
      </div>
    </>
  )
}

export default SectionWrapper(Works, '')
```

- [ ] **Step 2: Verify visually in dev server**

Reload `http://localhost:5173` (preview tool). Scroll to the Works section. Confirm:
- Rubi appears at the top of the section as a **wide hero card** with the 4 phone mockups visible on the right (or stacked on mobile)
- Phones float subtly (y-axis sine animation)
- "Live on App Store" pill is pink
- The 14 tech tags appear below the description
- "Voir sur l'App Store ↗" button is gradient pink/purple
- "Code source privé" italic note appears below
- Below the featured card, Kaza / Hot Takes / Kanap appear as the existing tilt cards

- [ ] **Step 3: Verify responsive behavior**

In the preview tool, resize to:
- Mobile (375×812): Featured card stacks vertically — phones appear below the text block
- Tablet (768×1024): Same stacked layout (lg breakpoint is 1024)
- Desktop (1280×800): Side-by-side layout, phones on the right

Use `preview_eval` to confirm no horizontal scroll on any size:

```js
({ vw: window.innerWidth, scrollW: document.documentElement.scrollWidth })
```

Expected: `scrollW <= vw` on all three sizes.

- [ ] **Step 4: Verify the App Store link opens externally**

In the preview, click the "Voir sur l'App Store" link. It should open https://apps.apple.com/us/app/rubi-pays-you/id6720740387 in a new tab.

- [ ] **Step 5: Commit**

```bash
git add src/components/Works.jsx
git commit -m "feat: Works renders featured projects via FeaturedProject component"
```

---

### Task 8: Deploy and verify production

**Files:** none (push only)

- [ ] **Step 1: Push to main**

```bash
git push origin main
```

Expected: GitHub accepts the push. Vercel auto-redeploys (visible at https://vercel.com/ia-pour-la-gestion-des-stocks/portfolio-hugo).

- [ ] **Step 2: Wait for Vercel deployment (≈1 min)**

Run:

```bash
sleep 90 && curl -o /dev/null -s -w "%{http_code}\n" https://portfolio-hugo-ten.vercel.app
```

Expected: `200`

- [ ] **Step 3: Verify Rubi is visible in production**

Open https://portfolio-hugo-ten.vercel.app in a browser. Scroll to the Works section. Confirm:
- Rubi featured card is present with the 4 phone mockups
- Lenis smooth scroll feels right across the whole page
- No console errors (open DevTools → Console)

If the screenshots don't load (broken image icons), check that `public/projects/rubi/screen-{1-4}.png` were committed and pushed. Run `git ls-files public/projects/rubi/` locally to verify.

- [ ] **Step 4: No commit needed**

Plan 1 is complete once production is verified.

---

## Self-Review Notes

**Spec coverage:** Plan 1 covers the spec's §6.1 (Works data structure), §6.2 (Featured project treatment — CSS version, full 3D in Plan 3), §6.6 (Rubi assets relocation), and partially §4.1 (Lenis setup — the canvas refactor itself is Plan 2).

**Not covered in Plan 1 (deferred):**
- Single global canvas refactor (Plan 2)
- ScrollControls + camera keyframes (Plan 4)
- Acts I-III scene morphs (Plan 4)
- Act V Earth pull-back (Plan 5)
- Drawer detail view (Plan 3)
- Carousel 3D for non-featured projects (Plan 3)
- Sound system + magnetism (Plan 6)
- Mobile reduced-motion test pass (cross-cutting, last plan)

**Risk / open items:**
- The phone layout uses absolute positioning with percentages. On very narrow screens between the lg breakpoint behaviors, the phone block may look cramped. If feedback is negative, adjust the layout in Task 6 by stacking phones vertically below 768px.
- The "tech badges" list (14 items for Rubi) is wide. On narrow viewports it wraps to 3+ lines. Acceptable for Plan 1; will refine in Plan 3.
