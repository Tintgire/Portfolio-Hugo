# PORTFOLIO HUGO

> 🇫🇷 **Français** · 🇬🇧 [Read in English](README.md)

Portfolio personnel de **Hugo Boidin** — AI Product Engineer, full-stack & mobile, automation & agents IA.

Direction cosmique-cinématique, bande-son procédurale gated par le scroll, scène 3D Hero, smooth-scroll, sound-aware. Pensé "digne des Game Awards" — premium, tactile, légèrement délirant.

**Live** · [portfolio-hugo-ten.vercel.app](https://portfolio-hugo-ten.vercel.app) _(déployé sur Vercel — auto-deploy depuis `main`)_

![React](https://img.shields.io/badge/React-18.2-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-4.3-646CFF?logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-0.152-000?logo=threedotjs&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-10-FF0080?logo=framer&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-38BDF8?logo=tailwindcss&logoColor=white)
![Lenis](https://img.shields.io/badge/Lenis-1.3-000?logoColor=white)
![Web Audio](https://img.shields.io/badge/Web_Audio-API-orange?logo=javascript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-000?logo=vercel&logoColor=white)

---

## ⚡ Stack

### Core

- **[React 18.2](https://react.dev)** — features concurrentes, function components, hooks
- **[Vite 4.3](https://vitejs.dev)** — dev server, modules ES, build de prod via Rollup (migré depuis CRA, voir _Décisions techniques_)
- **[React Router 6.11](https://reactrouter.com)** — SPA mono-route, prête à étendre vers des pages projet dédiées
- **[Tailwind CSS 3.3](https://tailwindcss.com)** — utility-first, tokens custom pour la palette cosmique
- **[Sass 1.62](https://sass-lang.com)** + **[styled-components 5.3](https://styled-components.com)** — gardés pour les modules legacy, le reste est en Tailwind

### Animation & motion

- **[Framer Motion 10.12](https://www.framer.com/motion/)** — `useScroll`, `useTransform`, `useMotionValue`, `useSpring`, `AnimatePresence` pour le drawer projet et le sound prompt, reveals au viewport
- **[Lenis 1.3](https://lenis.darkroom.engineering)** — wheel-scroll fluide, exposé via un React Context (`LenisProvider`) pour que n'importe quel composant puisse appeler `lenis.stop()` / `lenis.start()` et que le music driver puisse subscribe au scroll
- **[react-tilt](https://github.com/mkosir/react-tilt)** — tilt 3D sur les cards projet secondaires
- **`useMagneticHover`** — hook custom qui attire un bouton vers le curseur via motion values spring-smoothed ; bypass sur `prefers-reduced-motion`

### 3D / WebGL

- **[Three.js 0.152](https://threejs.org)** — moteur 3D
- **[@react-three/fiber 8.13](https://r3f.docs.pmnd.rs)** — renderer React pour Three
- **[@react-three/drei 9.66](https://drei.pmnd.rs)** — `useGLTF`, `Preload`, `PerspectiveCamera`, `Points`, `PointMaterial`, `OrbitControls`
- **[maath](https://github.com/pmndrs/maath)** — `random.inSphere` pour le nuage de particules violettes du Hero
- **`@mediapipe/tasks-vision`** — pinned pour des expérimentations face-aware à venir

### Audio

- **Web Audio API** (sans lib externe) — sons UI synthétisés et bande-son ambient à 4 couches gated par le scroll (`src/lib/audio/uiSounds.js`)
- **Scheduler lookahead** custom (tick 50 ms, horizon 100 ms) pour un timing sample-accurate sur les couches musicales
- Toutes les couches sont gated par le progrès de scroll global — `MusicScrollDriver` bridge Lenis (ou window scroll en fallback) vers `setMusicProgress(0..1)`

### Forms & integrations

- **[EmailJS 3.11](https://www.emailjs.com)** — le formulaire de contact envoie sans backend
- Données projets en JS pur dans `src/constans/index.js` — facile à étendre, pas de CMS headless

### Tooling

- **[Vite](https://vitejs.dev)** — dev + build (`vite`, `vite build`, `vite preview`)
- **[PostCSS](https://postcss.org)** + **[autoprefixer](https://github.com/postcss/autoprefixer)** — pipeline Tailwind
- **`@testing-library/react`** — présent, prêt pour des tests composants

---

## 🌐 Hébergement & infrastructure

| Service                                                          | Rôle                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| **[Vercel](https://vercel.com)**                                 | Déploiement prod, edge CDN, preview automatique par push, auto-deploy depuis `main`        |
| **[GitHub](https://github.com/Tintgire/Portfolio-Hugo)**         | Source control, source de vérité unique                                                    |
| **[gleitz / midi-js-soundfonts](https://gleitz.github.io)**      | Testé pour des samples GM réels, finalement rollback — la musique actuelle est full synth  |

---

## 🎨 Features visuelles & interactions

### Hero

- **Scène PC 3D** — modèle `Computers.gltf` rendu via React Three Fiber, avec une **caméra cinématique** (`CinematicCamera.jsx`) qui lerp de `[20, 3, 5]` vers `[12, 6, 12]` pilotée par `window.scrollY`, avec un sway subtil en `sin/cos` sur la clock
- **HeroParticles** — 800 (desktop) / 400 (mobile) particules violettes (#915EFF) samplées via `maath/random.inSphere`, rotation lente ; gated par `useReducedMotion`
- **Fade-out au scroll** — toute la scène hero passe à opacité 0 sur 60 vh de scroll via `useScroll` + `useTransform`
- **Animation typing** — "Hi, I'm Hugo / AI Product Engineer / Full-Stack & Mobile / Automation & AI Agents", avec un curseur CSS `@keyframes blink` qui imite un terminal desktop

### Navbar

- Sous-titre responsive qui révèle progressivement les rôles selon le breakpoint (`sm`, `lg`, `xl`)
- Chip **`SoundToggle`** à gauche des nav links — SVG speaker-on / speaker-off avec `aria-pressed`, hover magnétique, sync à travers l'app via `CustomEvent`

### Works — projets featured

- **`FeaturedProject`** est un seul composant avec deux variantes `mockup` :
  - **`phones`** (par défaut) — quatre mockups iPhone empilés en 3D (`rotateY`, `rotateZ`, scale, opacity, `perspective: 1000px`), animation de flottement vertical douce
  - **`browser`** — un seul frame style laptop, traffic lights macOS dans la chrome bar, pill URL, screenshot 16:10
- **CTAs** — hover magnétique (`useMagneticHover`), click déclenche `playClick` et ouvre le drawer projet
- Champ optionnel `ctaLabel` par projet pour une élision française propre (`Voir sur l'App Store ↗` vs `Voir sur le site ↗`)

### Project drawer

- **`ProjectDrawer`** est portail vers `document.body` via `createPortal` — échappe le stacking context `relative z-0` de la section qui le faisait rendre derrière les sections suivantes
- Side-panel slide-in (`x: '100%'` → `x: 0`) avec backdrop blur
- `data-lenis-prevent` sur le panel — Lenis intercepte les wheel events globalement, cet attribut redonne le contrôle wheel à l'overflow natif du panel
- Appelle `lenis.stop()` à l'ouverture via le hook `useLenis()` — la page derrière ne dérive pas pendant qu'on lit
- **Focus trap** — focus sur le bouton close au mount, restore le focus précédent au unmount, Escape ferme
- **`DrawerGallery`** — image hero 16:10 + strip de vignettes, cross-fade `AnimatePresence` au changement actif, tableau optionnel `imagePositions` par projet pour ajuster l'`objectPosition` par image

### Sound design

Le site a deux couches audio qui se complètent :

**1. Sons UI** — cues synthétisés courts (helpers `tone()`, `sweep()` dans `uiSounds.js`) :

| Trigger                                  | Son                                      |
| ---------------------------------------- | ---------------------------------------- |
| Click sur card projet                    | `playClick` — sine 880 Hz + overtone 1320 Hz décalé |
| Ouverture drawer                         | `playDrawerOpen` — double sweep 320→880 Hz sine + 480→1100 Hz triangle |
| Fermeture drawer (Escape, ×, backdrop)   | `playDrawerClose` — sweep descendant 880→280 Hz sine |
| Toggle son ON                            | `playToggle` — confirmation deux notes 660→990 Hz |
| Changement de vignette gallery           | `playTick` — tick court 1320 Hz          |
| Card timeline Expérience entre en viewport | `playTick`                             |
| Envoi formulaire contact réussi          | `playSubmit` — arpège success Do5 → Mi5 → Sol5 |

**2. Bande-son ambient layered au scroll** — partition à quatre voix en Do mineur qui se construit au fil du scroll :

| Couche   | Trigger                                          | Synth                                                                |
| -------- | ------------------------------------------------ | -------------------------------------------------------------------- |
| `drone`  | 0% scroll                                        | Accord sine C2 + G2 + Eb3 + C4, respiration LFO lente par voix       |
| `plucks` | 25% scroll                                       | Arpège triangle en Do mineur à 60 BPM, scheduling lookahead          |
| `breath` | 50% scroll                                       | Pad triangle détuné avec LFO de swell 0.1 Hz (l'accord respire)      |
| `bells`  | Quand la card Rubi entre dans le viewport        | Mélodie sine + harmonique 2×, sparse, reste jusqu'au bas de la page  |

Les couches fade-in / fade-out symétriquement — remonter au-dessus d'un seuil déclenche un fade-out de 2 s.

**Activation** — un modal centré (`SoundPrompt`) apparaît 1,5 s après chaque load frais, demandant à l'utilisateur d'opt-in. Le state du son est gardé en mémoire de module (pas de `localStorage`, pas de `sessionStorage`) — reset garanti à chaque refresh, donc l'utilisateur reconfirme toujours.

### Feedbacks — bento + marquee infinie

- **Layout bento** — un témoignage featured (`lg:col-span-3`) avec fond gradient violet→rose et halo glow rose au coin, sidebar de deux cards compactes (`lg:col-span-2`) empilées verticalement
- **Marquee infinie lente** — la liste des témoignages est doublée (`[...testimonials, ...testimonials]`) et translatée `-50%` sur 40 s via `@keyframes testimonial-marquee` pur CSS, les bords fadent via un mask gradient (`testimonial-marquee-wrap` avec fade gauche/droite), pause au hover, bypass complet sous `prefers-reduced-motion`
- Footer des cards (avatar + nom + rôle) aligné en bas avec `mt-auto` pour que les cards aux quotes de longueurs variables s'alignent horizontalement
- Le label de rôle s'adapte : `${designation} chez ${company}` si `company` est défini, sinon juste `${designation}` (pour que les indépendants sans entreprise ne render pas un "chez" pendant)

### Contact — wizard conversationnel

- **Flow style Typeform** — 3 étapes animées avec `motion.div key={step}` (volontairement **pas** wrappé dans `AnimatePresence` — son `mode="wait"` laissait du contenu stale dans le DOM) : nom → email → composite (chips sujet + textarea message)
- Le titre de l'étape 2 est personnalisé : `Enchanté ${firstName}, comment je peux te joindre ?`
- **Chips sujet** — Recrutement / Projet freelance / Collab / Autre, toggle on/off, préfixés au corps de l'email sous `[Sujet : X]`
- Fonction `validate` par étape, toast erreur inline, success state qui remplace le form pendant 4 s avant de reset
- **`focus({ preventScroll: true })`** sur l'auto-focus + guard `isFirstRender` pour que la page ne saute pas vers le form au chargement initial
- **Click-to-copy email** dans le ContactsStrip — `navigator.clipboard.writeText(SOCIAL.email)`, feedback "Copié !" transient pendant 2 s (pas de fallback `mailto:` — plus universel, pas de client mail natif requis)
- **Earth 3D** — modèle GLTF, `OrbitControls` contraints à la rotation horizontale, `autoRotate`, rim violet + fill rose ; la zone de contenu d'étape est `min-h-[320px]` pour que le canvas Earth qui mirror sa hauteur via `xl:h-auto` ne grossisse pas quand l'étape 3 introduit le layout composite plus haut
- Submit via **EmailJS** en utilisant les env vars `import.meta.env.VITE_EMAILJS_*` (Vite les injecte au build, credentials dans `.env.local` en local et dans les Environment Variables Vercel en prod)

### Responsivité mobile

- **Split Hero** — sur `<sm`, le canvas 3D est restreint à une bande médiane (`top: 45%`, `bottom: 90px`) pour que le titre se pose proprement au-dessus et que l'arrow scroll-down ait son propre strip en dessous ; sur `sm+` le canvas reprend toute la section et le texte overlay dessus (look cinématique d'origine)
- **Overlay navbar** — le burger morph en X (deux barres rotate via framer-motion), overlay full-screen portail-rendu avec gradient radial violet + `backdrop-blur(14px)`, les 3 nav links en `text-5xl` avec gradient white→pink→purple + stagger entry (`delay: 0.1 + i * 0.08`), footer social (Email / LinkedIn / GitHub en boutons pill) en bas, Escape ferme, scroll body verrouillé pendant l'ouverture
- **Rail timeline Expérience sur mobile** — le `RailFill` desktop se render maintenant aussi sur mobile, repositionné de la colonne centrale (`left-1/2`) vers une gutter gauche (`left-3`). Les cards prennent `pl-8 lg:pl-0` pour dégager le rail. Pas de dots par card — le leading edge du gradient du rail est le marqueur de position de scroll
- **Grilles de cards à hauteur égale** — les services `About`, les projets secondaires `Works` et la sidebar `Feedbacks` utilisent CSS Grid (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`) plutôt que `flex-wrap` pour garantir que les cards d'une même ligne ont la même hauteur via l'intrinsic row sizing du grid (la chaîne `h-full` sur du flex-wrap s'est avérée non fiable selon les navigateurs)
- **Auto-scroll des vignettes du DrawerGallery** — `useEffect(activeIndex)` appelle `scrollIntoView({ inline: 'center' })` sur la vignette active pour que la bordure violette de sélection reste visible quand la strip déborde horizontalement sur écrans étroits

### Cross-cutting

- **`prefers-reduced-motion`** — Lenis bypass, particules sans rotation, hover magnétique désactivé, son force-disabled, animation marquee désactivée
- **Mobile-aware** — hook `useIsMobile` qui ajuste le nombre de particules, simplifie les layouts, et décale le PC 3D plus à gauche pour contrer le right-bias de la caméra
- **Pattern portail** — drawers, modal son et overlay nav mobile sont tous portail vers `document.body` pour échapper aux stacking contexts créés par les section wrappers
- **Reload-to-top** — `index.jsx` force `history.scrollRestoration = 'manual'` + `window.scrollTo(0, 0)` pour que F5 atterrisse toujours sur le hero (les navigateurs restaurent la position de scroll précédente par défaut, ce qui cassait l'expérience "atterrir sur le titre")

---

## 🧠 Décisions techniques / skills démontrés

- **Migration CRA → Vite** — graph de dépendances gardé, entrée réécrite en `index.html` + `src/index.jsx`, JSX renommés, `vercel.json` ajouté avec `framework: "vite"` + `outputDirectory: "dist"`
- **State audio module-level** au lieu de storage — `soundEnabledState` vit dans la closure du module `uiSounds`. Reload de la page → ré-import du module → state reset → `SoundPrompt` réapparaît. Simple, pas de race condition avec le bfcache, pas besoin de raisonner sur la sémantique session vs local storage.
- **Sync cross-composant via `CustomEvent`** — `setSoundEnabled` dispatche `portfolio:sound-enabled-change`. Le `SoundToggle` de la navbar écoute et relit le state. Pas de Context, pas de prop drilling pour un seul boolean.
- **Scheduler Web Audio lookahead** — toutes les 50 ms, queue toutes les notes dont le start time tombe dans les 100 prochaines ms. Onset des notes sample-accurate quel que soit le jitter du main thread. Les quatre couches musicales partagent un `globalStartTime` pour que les beats restent en phase quand une couche rejoint en cours de morceau.
- **`AudioContext.resume()` à la première interaction** — `armResumeOnInteraction()` enregistre un listener one-shot sur `click` / `keydown` / `scroll` / `touchstart` / `pointerdown`. Le drone est créé dès que l'utilisateur opt-in mais ne devient audible que quand la politique autoplay le permet ; pas d'UX ambiguë "est-ce que le son a marché ?".
- **Bridge Lenis ↔ React** — `LenisProvider` expose l'instance via Context. `MusicScrollDriver` subscribe à `lenis.on('scroll', …)` sur desktop et fallback sur `window.scroll` pour les utilisateurs reduced-motion. `ProjectDrawer` appelle `lenis.stop()` à l'ouverture et ajoute `data-lenis-prevent` pour que les wheel events bubble back vers l'overflow natif.
- **Pattern portail pour échapper les stacking contexts** — `ProjectDrawer` et `SoundPrompt` portail vers `document.body`. Sans ça ils étaient piégés derrière les sections suivantes (la section `Feedbacks` peignait _au-dessus_ d'un drawer qui vit dans la section `Works` parce que les deux ont `relative z-0`).
- **Conflit framer-motion vs Tailwind transform** — les composants `motion.*` prennent le contrôle de la propriété CSS `transform`, donc `-translate-x-1/2 -translate-y-1/2` pète silencieusement. Le `SoundPrompt` utilise un wrapper `position: fixed inset-0 flex items-center justify-center` à la place, et le `motion.div` interne est un enfant en flow normal.
- **IntersectionObserver avec `rootMargin` étendu** — les bells utilisent `rootMargin: '99999px 0px 0px 0px'`. Une fois la card Rubi entrée dans le viewport, le bord top étendu la garde en intersecting indéfiniment quand on scroll dessous — les bells restent jusqu'au bas de la page, fade-out seulement quand on remonte au-dessus.
- **`objectPosition` par image** — `DrawerGallery` accepte un tableau `imagePositions` sur la shape du projet ; un des screenshots Rubi avait son contenu packé en bas et `object-cover center` le cachait.
- **Fix de la largeur du mockup phones** — le conteneur des 4 iPhones avait un layout à enfants absolute uniquement, donc sans `width` explicite il rétrécissait à 0 et les pourcentages s'écroulaient au bord droit. Mettre `w-full max-w-[420px]` rétablit le spread des 4 mockups.
- **CSS Grid > chaîne flex-wrap + h-full pour les hauteurs égales** — le flex-wrap dépend du moteur de rendu pour cascader `h-full` (cassé entre Chromium et WebKit), l'intrinsic row sizing de CSS Grid est déterministe. Utilisé pour les cards services About, les cards secondaires Works, et la sidebar Feedbacks.
- **`AnimatePresence` `mode="wait"` laisse du contenu stale** — wrapper le contenu d'étape du wizard dans `AnimatePresence mode="wait"` laissait le DOM de l'étape précédente en place quand `key` changeait (bug visible : le compteur affichait 02/03 avec l'input de l'étape 1 toujours rendu). Remplacé par un simple `motion.div key={step}` — React gère le unmount/remount, framer-motion joue l'animation d'entrée, aucune race condition.
- **Conflit transform `framer-motion` entrée vs Tailwind `hover`** — `whileHover` et une entrée à base de `variants` partagent la même matrice `transform`. Après relâche du hover, framer-motion restaure le transform des variants d'entrée (incluant le delay), donc la card "fige" à la position liftée pendant `0.15 * index` secondes avant de redescendre. Fix : split en deux éléments — un `motion.div` extérieur pour l'entrée uniquement, un `<article>` intérieur avec `hover:-translate-y-2` en CSS pur. Les transforms sur des éléments séparés ne rentrent pas en conflit.
- **Flicker de re-rastérisation `blur-3xl` sur iOS Safari** — les large blurs CSS sur des éléments translatés sont re-rastérisés à chaque frame de scroll sur iOS, visible comme un flicker dans les halos glow des coins des cards `FeaturedProject`. Promu les halos à leur propre couche compositor avec `transform: translateZ(0)` + `will-change: transform` — le GPU garde la tile blurée rastérisée en cache.
- **`focus({ preventScroll: true })` pour l'auto-focus** — auto-focus le premier input du wizard au mount faisait scroller le navigateur vers le form, faisant sauter l'utilisateur au-delà du hero. L'option `preventScroll` garde le focus sans déclencher `scrollIntoView`. Ceinture et bretelles : une ref `isFirstRender` skip aussi le focus au tout premier mount.
- **`scrollRestoration` manuelle pour reload-to-top** — les navigateurs sont en `scrollRestoration: 'auto'` par défaut, ce qui restaure la position de scroll précédente au F5. Combiné avec le typewriter cinématique censé jouer au premier paint, ça cassait l'expérience "atterrir sur le hero". `window.history.scrollRestoration = 'manual'` + `window.scrollTo(0, 0)` dans le fichier d'entrée avant le mount React force un atterrissage en haut de page à chaque reload.
- **EmailJS via `import.meta.env.VITE_*`** — les credentials hardcodés en source étaient un smell (même si la public key est embarquée dans le bundle de toute façon, la baker dans le repo veut dire qu'une rotation requiert un commit). Migré vers `.env.local` (gitignored) en local dev et Vercel Environment Variables en prod. `.env.example` documente les 3 clés requises pour les futurs contributeurs.
- **Layout split Hero mobile** — le canvas 3D PC couvrait le titre sur mobile (le GLTF remplit tout le viewport 375 px). Premier essai : `z-index: 10` sur le titre — ça a juste inversé le problème (titre cachait alors le bureau). Vrai fix : garder les deux visibles en splittant la section verticalement — canvas `top: 45%, bottom: 90px`, titre dans la moitié haute, arrow scroll-down dans le strip de `90 px` libéré sous le canvas. Desktop inchangé (canvas full-screen, titre en overlay).
- **Centrage du modèle 3D sur mobile** — le combo GLTF + caméra a un right-bias inhérent : la caméra est à `x: 20` (skew de perspective) et le modèle du bureau est asymétrique (la PC tower est à droite du monitor). Counter-shift du modèle `x: -2.5` sur mobile uniquement — desktop garde `x: 0` parce que le canvas full-screen masque le bias.
- **Rail timeline mobile sans dots** — adapté le `RailFill` desktop au mobile en repositionnant de column-center (`left-1/2`) vers une gutter gauche fixe (`left-3`). Première itération : ajout de dots par card alignés sur le rail ; ils paraissaient visuellement déconnectés des cards. Supprimés entièrement — le leading edge du gradient du rail marque déjà la position de scroll, et les cards elles-mêmes sont les milestones.
- **Auto-scroll des vignettes `DrawerGallery`** — sur écrans étroits la strip de vignettes déborde horizontalement ; naviguer jusqu'à la dernière image laissait sa bordure violette de sélection hors écran. `useEffect` sur `activeIndex` appelle `scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })` sur le bouton actif.

---

## 🎭 Direction artistique

Cosmique cinématique. Sombre, violet profond, accents en gradient qui fade vers le rose. Premium et tactile — chaque CTA attire le curseur, chaque click est acquitté, la musique s'épaissit au fil du scroll.

### Palette

| Token                  | Valeur    | Usage                                                |
| ---------------------- | --------- | ---------------------------------------------------- |
| `primary`              | `#050211` | Background page — nuit profonde                      |
| Featured card top      | `#1a0a35` | Haut du gradient sur les cards projet featured       |
| Featured card mid      | `#2a1156` | Milieu du gradient                                   |
| `#915EFF`              | violet    | Accent principal — particules, borders, focus rings  |
| `pink-500` (Tailwind)  | `#ec4899` | Accent secondaire — dot live, fin de gradient        |
| `purple-300/40`        | overlay   | Borders soft sur surfaces sombres                    |

### Typographie

- Titres — `font-black`, `tracking-tight`, `bg-clip-text` sur un gradient `from-white via-pink-300 to-purple-400`
- Corps — défauts Tailwind, `text-white/85` pour le primaire, `text-white/55` pour le muted
- Tech / metadata — `text-[10px] tracking-[0.3em] uppercase` pour le vibe editorial-tech

---

## 🗂 Structure du projet

```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── About.jsx
│   ├── Experience.jsx              # Timeline verticale + playTick par card au viewport-enter
│   ├── DownloadSection.jsx         # Téléchargement CV / diplôme
│   ├── Tech.jsx
│   ├── Works.jsx                   # Cards featured + secondaires, mount du drawer
│   ├── Feedbacks.jsx
│   ├── Contact.jsx                 # Formulaire EmailJS + canvas Earth
│   ├── SoundToggle.jsx             # Chip navbar, écoute les events sound-enabled
│   ├── SoundPrompt.jsx             # Modal centré "Active le son" à chaque load
│   ├── canvas/
│   │   ├── Computers.jsx           # Scène PC Hero + caméra cinématique + particules
│   │   ├── CinematicCamera.jsx     # Lerp caméra scroll-driven + sway
│   │   ├── HeroParticles.jsx       # Nuage de particules violettes
│   │   ├── Earth.jsx               # Earth 3D Contact avec rim lighting
│   │   └── Stars.jsx
│   └── works/
│       ├── FeaturedProject.jsx     # Variante mockup phones OU browser
│       ├── ProjectDrawer.jsx       # Side panel portail avec focus trap
│       └── DrawerGallery.jsx       # Image hero + strip de vignettes
├── lib/
│   ├── LenisProvider.jsx           # Context Lenis, bypass prefers-reduced-motion
│   ├── MusicScrollDriver.jsx       # Bridge scroll Lenis → setMusicProgress
│   ├── audio/
│   │   └── uiSounds.js             # Tous les sons UI synth + bande-son 4 couches
│   └── hooks/
│       ├── useReducedMotion.js
│       ├── useIsMobile.js
│       ├── useScrollProgress.js
│       ├── useMagneticHover.js
│       └── useSoundToggle.js       # Écoute le CustomEvent sound-enabled
├── constans/
│   └── index.js                    # Données projets, expériences, témoignages
├── pages/
│   └── Home/
│       └── Home.jsx
├── App.jsx
└── index.jsx                       # Mount + wrap LenisProvider
public/
└── projects/
    ├── rubi/                       # 4 screenshots mobile
    └── lou/                        # 5 screenshots desktop
```

---

## 🛠 Scripts

```bash
yarn dev        # démarre le dev server Vite sur http://localhost:5173
yarn build      # build production → dist/
yarn preview    # sert le build production en local
```

---

## 📦 Projets featured

Deux projets mis en avant dans la section Works :

### Rubi te paye — _mobile_

App iOS qui paie les utilisateurs pour leurs données personnelles. Consentement granulaire, wallet in-app, créditement temps réel. Stack JS bout-en-bout centrée sur Firebase + GCP, avec Memgraph/Neo4j pour le graphe de relations et Stripe pour le paiement. Disponible sur l'[App Store](https://apps.apple.com/us/app/rubi-pays-you/id6720740387) — code source privé.

### Lou Studio — _editorial web_

Portfolio éditorial brutaliste pour [Lou Boidin](https://www.instagram.com/lou.boidin/), makeup artist & styliste parisienne. Scroll cinématique, iPhone 3D Three.js custom avec projection de texture `DecalGeometry`, bilingue FR / EN. Live sur [portfolio-lou-six.vercel.app](https://portfolio-lou-six.vercel.app/fr) — source sur [Tintgire/Portfolio-Lou](https://github.com/Tintgire/Portfolio-Lou).

---

## 📫 Contact

- **Email** — [boidinhugo14@gmail.com](mailto:boidinhugo14@gmail.com)
- **GitHub** — [@Tintgire](https://github.com/Tintgire)

---

## ©

Tous droits réservés. Le code est public à des fins de revue de portfolio ; le projet n'est pas licencié pour redistribution ou réutilisation.
