# Changelog — DreamSleeve Site

All notable changes to the DreamSleeve investor/customer site.
Format loosely follows [Keep a Changelog](https://keepachangelog.com/).
Dates are absolute (YYYY-MM-DD).

## [Unreleased]

### 2026-11-26 — Step 32: Section snapping + keyboard navigation
- **Keyboard navigation**: Arrow Up/Down, Page Up/Down, and Home/End now move between
  sections (skipped inside form fields / with modifier keys). Works with or without GSAP —
  keyboard-only visitors can traverse the whole page.
- **Gentle proximity snap**: after the wheel/trackpad settles *near* a section start, the page
  snaps that section to just below the header. Proximity-only, so stopping mid-section never
  yanks you — no scroll hijacking.
- Both use **native smooth scroll** (not GSAP's ScrollToPlugin), which — unlike a plugin tween —
  is never blocked by a ScrollTrigger pin.
- **Un-pinned the hero**: the cinematic hero is now a scrub *parallax* (same push-in + dissolve)
  rather than a hard pin, because a pinned section can't be reached by snap/arrow nav from below.
  Everything else (parallax layers, replaying section reveals) is unchanged.

### 2026-11-26 — Step 31: Cinematic GSAP scroll (supersedes the CSS-snap approach)
- Added **GSAP 3.12 + ScrollTrigger**, **vendored and self-hosted** in `assets/vendor/` (no CDN,
  no npm), loaded `defer`.
- **Cinematic scroll**: the hero is a **scrub-pinned** transition (copy drifts up and dissolves
  while the arm photo pushes in via parallax); the background grid and every section headline
  are **parallax layers**; section content reveals in a **staggered cascade that replays** each
  time a section re-enters the viewport.
- **Progressive enhancement**: wrapped behind a `gsapReady` guard — if the libs fail to load, or
  the visitor prefers reduced motion, the site falls back to the existing `IntersectionObserver`
  reveals (verified: reduced motion creates 0 ScrollTriggers and shows all content statically).
- Updated the README (dependency/stack/perf/motion sections) to reflect the vendored libraries.
  This replaces the lightweight CSS `scroll-snap` direction explored in PR #19.

### 2026-11-26 — Step 30: Sync README + remove dead code after section removals
- **README** brought in line with the current lean site (Hero · Science · Game · Market):
  dropped the Pathway and Ask/form walkthrough entries + their screenshots, removed the
  Formspree/lead-form rows from the stack and JS-module tables, trimmed the Configuration and
  Disclaimer sections, and refreshed the line-count figures.
- **Removed orphaned code** left behind by the section removal: the lead-form JS controller,
  and the `.timeline`/`.ask*`/`.lead-form*`/`.phase*`/`.pill*`/`.pathway__foot`/`.header-cta`/
  `.btn--ghost`/`.btn--lg`/`.sr-only` CSS (all confirmed 0 usages). Deleted the now-unused
  `pathway.png` and `ask.png` screenshots. (CSS ~450→~350, JS ~195→~130 lines.)

### 2026-11-26 — Step 29: Trim footer legal text
- Shortened the footer disclaimer to just the **General Wellness** statement (not a cleared/
  approved device, no diagnostic/treatment claims). Removed the "Class II clearance / EPSDT
  reimbursement / planned pathways" and "illustrative pending verification" sentences.

### 2026-11-26 — Step 28: Fold the session steps into the Science slide
- **Merged the "session, as the child plays it" 4-step list into the Science section** as a
  static stepper (Fitting & Calibration → Antiseptic Prep & Shield Charge → Shield Strike &
  Injection Window → Victory Cascade), so it reads on the same view as "Two signals. One
  nervous system. No gap."
- **Removed the standalone Mission section** — the full-height scroll-scrubbed sticky cinematic
  (its 4 narrative phase panels, `#mission` footer link, the mission JS stage controller, and
  all `.mission*` CSS incl. responsive/reduced-motion rules). Added a lightweight `.session`
  stepper component in its place.
- Updated the README (dropped the Mission note + JS-module row, reworded the motion principle).

### 2026-11-26 — Step 27: Remove the Device section
- **Removed the entire Device section** — the "console that makes the invisible legible"
  intro, the engineering schematic (Fig. 01/02 + cross-section + circuit index), and the
  Chronosomatic Injection Synchronization Pipeline (stage tabs + live telemetry console).
- Cleaned up everything it touched: nav + footer `#device` links (hero "See the device"
  CTA repointed to `#science`), the `.schematic`/`.console`/`.phase-*`/`.circuit`/`.meter`
  CSS and dead responsive rules, the pipeline-tabs JS controller, the README device
  walkthrough + architecture references, and the now-unused `schematic.webp`/`schematic.png`
  + device screenshots. Restored the shared `.pill` base styles (still used by the Pathway
  status pills). Updated line-count figures in the README.

### 2026-11-26 — Step 26: Trim competitor content + schematic caption
- **Removed the Problem section** entirely ("Escaping the single-modality trap" — the three
  competitor-category cards and the verdict bar), including its nav + footer links, the dead
  `.trap*`/`.verdict` CSS, the README walkthrough entry, and `docs/screenshots/problem.png`.
- **Removed the Fig. 01 figcaption** under the main engineering schematic. Fig. 02
  (cross-section) and the Circuit-index caption are unchanged.

### 2026-11-26 — Step 25: Mobile nav + analytics + remove Team section
- **Mobile hamburger nav**: below 920px the primary nav no longer vanishes — it collapses into
  an accessible dropdown behind an animated hamburger toggle (`aria-expanded`/`aria-controls`,
  Escape to close, closes on link tap, resets on resize to desktop). Fixes a11y audit item I3.
- **Privacy-friendly analytics**: optional **GoatCounter** snippet (no cookies, GDPR-friendly)
  that loads only once a site code is filled in; until then nothing is requested or sent.
- **Removed the Team section** entirely (markup, nav/footer links, CSS, README walkthrough +
  `docs/screenshots/team.png`) — deferred for later.

### 2026-11-26 — Step 24: Quick wins — active-nav scroll-spy + branded 404
- **Active-nav scroll-spy**: the header nav now highlights the section currently in view
  (cyan link + glow underline, `aria-current="true"`), driven by an `IntersectionObserver`
  with a mid-viewport activation band in `scripts/main.js`. No new dependencies.
- **Branded 404 page** (`404.html`): a self-contained, on-brand "signal lost" page GitHub
  Pages serves for unknown paths; inline styles, links back to the site root (`./`).

### 2026-11-26 — Step 23: Professional branded README
- Rewrote `README.md` as a detailed, brand-styled document: a rendered banner, brand-colour
  badges, a full **site walkthrough with a screenshot per section**, **software architecture**
  (stack, file tree, JS modules, CSS architecture), the **design system** (colour tokens with
  swatches, type roles, motion principles), setup/local-dev, deployment (project-page sub-path),
  configuration, accessibility, and performance.
- Added `docs/banner-template.html` (banner source) and `docs/screenshots/*.png` (11 images:
  banner, hero, and every section) rendered from the live sections with headless Chrome.

### 2026-11-26 — Step 22: Portability for a new host + live Formspree endpoint
- **Wired the real Formspree endpoint** (`mljbvovv`) into the Ask-section form `action`; it now
  submits for real (AJAX, stays on page).
- **Made the site deploy-correct for a GitHub Pages project page** at
  `https://dreamsuit.github.io/DREAMSUIT-WEBSITE-MAIN/` (a subpath): confirmed all asset paths are
  relative (CSS/JS/images/fonts/favicon/manifest), and repointed the only absolute URLs
  (canonical, og:url, og:image, twitter:image, JSON-LD @id/url/logo/brand, `sitemap.xml`,
  `robots.txt`) from the `dreamsleeve.com` placeholder to the project URL.
- **Fixed `site.webmanifest`** for a subpath: `start_url`/`scope` → `./` (were `/`, which pointed
  at the github.io root), and refreshed the description (dual-audience, no em dash).
- Updated README deploy steps for the project-page URL and the custom-domain swap; noted the
  form is live.
- Verified via a simulated subpath serve: CSS/JS/images load with **zero 404s**, styles apply,
  manifest + JSON-LD valid, 0 em dashes.

### 2026-11-26 — Step 21: Lead-capture form (Formspree)
- Replaced the two `mailto:` buttons in the Ask section with an on-site **lead-capture form**
  (name, email, organization, interest dropdown, message), posting to **Formspree via AJAX** so
  the visitor stays on the page and sees an inline success/error state.
- Includes a honeypot (`_gotcha`) and `_subject`; client-side required-field validation; and a
  graceful "not connected yet" message while the placeholder `YOUR_FORM_ID` endpoint is unset.
- Swap `YOUR_FORM_ID` in the form `action` for a real Formspree endpoint to go live (README has
  the step). Kept the email fallback. Still zero JS dependencies; no em dashes.

### 2026-11-26 — Step 20: Site improvements (stats, team, OG image, accessibility, perf)
- **Market stats → real, sourced, dual-audience figures.** Replaced the placeholder stats with:
  16B injections given worldwide/yr (WHO); 1 in 10 US adults now use a GLP-1 (CDC, 2025); 1 in 4
  young adults fear needles (2019 meta-analysis); plus the 4 ms sync budget. Each carries an
  inline source tag. (No reliable public "needle-anxiety device" market figure exists, so TAM is
  left for a bottom-up build.)
- **New Team section (`#team`)** — "Who's building this": founder/advisor cards scaffolded with
  `INFO NEEDED` for names, roles, bios, plus a clinical & advisory block. Linked in the footer nav.
- **Fresh social share image** — regenerated `assets/og-image.png` (1200×630) to match the current
  photographic hero (was the old telemetry-console render); updated OG/Twitter image alt text.
- **Accessibility (from an audit):** bumped `--faint` #5c6f88 → #7587a0 so small text (legal
  disclaimer, telemetry labels) passes WCAG AA; decorative lock emoji now `aria-hidden`; skip link
  targets `#top`; added a visually-hidden `<h2>` for the Mission section (+ an `.sr-only` utility).
- **Performance:** converted the 1.59 MB schematic PNG to **WebP (70 KB, −96%)** served via
  `<picture>` with a PNG fallback.
- Verified: JSON-LD valid, tags balanced, 0 em dashes, no horizontal overflow at 390/1440,
  browser loads the WebP, count-ups reach their targets.

### 2026-11-26 — Step 19: Placeholder markers relabeled "INFO NEEDED"
- Replaced every on-site `[placeholder]` marker (and the one `[placeholder address]`) with
  **INFO NEEDED** so the gaps are unmistakable before launch: the three market stats, four
  traction milestones, the leaderboard season score, the deck-request email, and the footer
  legal line. The `[titles illustrative]` and `[status: pre-submission]` clarifier tags are
  left as-is. JSON-LD valid; tags balanced.

### 2026-11-26 — Step 18: Remove the hero telemetry strip
- Removed the four-stat telemetry readout (TENS CURRENT / PIEZO VOLTAGE / SYNC LATENCY /
  ALIGNMENT LOCK) from the hero, decluttering the left column. The headline, lede, and CTAs remain.
- Deleted the now-dead CSS (`.telemetry-strip`, `.tstat*`, `.live-dot*`, `@keyframes blink`,
  and the two mobile overrides). JSON-LD valid; tags balanced.

### 2026-11-26 — Step 17: Device console stage chips become interactive tabs (injection pipeline)
- Turned the Device console's four stage chips into an accessible **tabbed stepper** for the
  **Chronosomatic Injection Synchronization Pipeline**: click (or arrow-key) a phase to reveal
  its detail panel above the live telemetry.
- Four phases from the client's copy, each with a timecode, description, and a Signal/Circuits/
  Action spec grid: **1 Arming & Calibration** (0:00–0:15, Tx:C Cumulus Drift), **2 Antiseptic
  Prep & Shield Charge** (0:15–0:30, Tx:S The Sandofal), **3 Needle Insertion & Shield Strike**
  (0:30, 500 ms / 100 Hz / 36–50 mA TENS on Circuits 11+12, Aβ gate closure), **4 Victory
  Cascade** (0:32+, Tx:H Hydro-Static Silk, dopamine frisson, then blast the pathogen).
- Full ARIA tab pattern: `role="tablist/tab/tabpanel"`, `aria-selected`, roving `tabindex`,
  Arrow/Home/End keys. Active chip lights its accent (red/amber/green/green) like the mock.
- Vanilla JS (no deps); reduced-motion safe; verified: tabs switch correctly (CDP), 0
  exceptions, JSON-LD valid, no em dashes reintroduced, no horizontal overflow at 360/390/1440.

### 2026-11-25 — Step 15: Hyper-realistic photographic hero (replaces the WebGL arm)
- Swapped the procedural Three.js hero for a **photographic hero**: a real arm wearing the
  sleeve (black fabric + glowing cyan triangulated wireframe overlay), per the client's
  reference. Procedural shading can't be photoreal, so this is the right call for "hyper-realistic."
- The photo (`assets/hero-arm.jpg`, cropped from the reference to remove its baked-in title,
  compressed to ~39 KB) is **anchored on the right and vignette-masked** (CSS radial `mask-image`)
  so it dissolves into the void behind a now **left-aligned headline** — matching the reference's
  text-left / arm-right composition. Subtle CSS drift + brightness pulse keep the wireframe
  "live"; both respect `prefers-reduced-motion`.
- **Removed** `scripts/hero3d.js` and the vendored `assets/vendor/three.module.js` (~687 KB) and
  the import map — the site is back to **zero JS dependencies and no build step**, now lighter.
- `.hero` clips its overflow; verified no horizontal overflow at 360/390/1440; JSON-LD valid.

### 2026-11-25 — Step 16: Em-dash cleanup (avoid-ai-writing audit)
- Audited the site copy with the installed **avoid-ai-writing** skill's deterministic detector:
  scored **Clean / HUMAN_ONLY** with Tier 1/2/3 vocabulary all zero. The single finding was
  **em-dash density** (~38 in ~1,500 words vs a ~1-per-1,000 target).
- Edit-mode pass: converted every prose em dash to a comma, colon, period, or parentheses
  (meaning preserved, punctuation only). Broke two "isn't X — it's Y" frames into clean
  sentences ("The memory that consolidates isn't fear. It's a level cleared."; "DreamSleeve
  doesn't distract from the needle. It rewrites what the needle is."). Titles/OG/Twitter use a
  colon; parenthetical asides use (). Re-ran the detector: **0 issues** remaining.
- JSON-LD still valid; section/div/p/figure/article tags balanced.

### 2026-11-25 — Step 14: Realistic X-ray arm for the 3D hero
- Rebuilt the hero sleeve as a **realistic, anatomical X-ray / engineering-schematic arm**
  in the style of the DreamSleeve schematic: a variable-radius swept tube along a natural
  arm curve (CatmullRom) — **shoulder → biceps → elbow → forearm → wrist → hand with fingers**,
  plus a subtle body/torso hint — rendered with a **Fresnel-rim "ghost" shader** (additive,
  double-sided) so the edges glow and the interior stays translucent, like a medical X-ray.
- The **fabric sleeve** is a brighter Fresnel band over the biceps and forearm; the four
  **circuit arrays (11-14)** sit on the sleeve surface via the curve's Frenet frames (front/back
  placement, amber Circuit 12), with TENS signal pulses flowing along the limb and electrode
  rings pulsing. Gentle 3/4 sway + mouse parallax.
- Still self-contained (vendored Three.js, no build), `prefers-reduced-motion` static frame,
  pauses off-screen, responsive reframing. Verified in headless Chrome (SwiftShader): shaders
  compile clean, 0 exceptions, no horizontal overflow at 360/390px.

### 2026-11-25 — Step 13: Re-broadened to the dual audience (pediatric + adult self-injection)
- Added the adult audience back alongside pediatric, per client's therapeutic-objective copy.
  DreamSleeve now mitigates **needle distress, acute procedural anxiety, and somatic muscle
  guarding** across **routine pediatric immunizations AND adult self-injections — GLP-1
  regimens and Type 1 Diabetes insulin.** The gamified pediatric content stays as the kids' segment.
- **Science** intro now leads with that objective + dual audience, and the "passive medical
  encounter → active, embodied experience" framing (TENS Gate Control + piezo texture are the pillars).
- **Hero** lede: "from a child's first vaccine to an adult's weekly GLP-1 pen."
- **Problem** intro → "a patient … at any age." **Device** → "clinicians and self-injecting
  patients" + **profile-matched ceiling** (PED 40 mA / ADULT 60 mA). **Market** moat → "one
  platform, a lifetime of injections." **Traction** → peds + adult self-injection sites.
- **Meta/SEO/JSON-LD** broadened: title → "…for Needle Distress"; description, keywords, OG,
  Twitter, Org + Product descriptions, and `MedicalAudience` now include adult GLP-1 / insulin
  self-injectors. JSON-LD validated.

### 2026-11-25 — Step 12: 3D hero (Three.js) — the DreamSleeve neuro-signal field
- Redesigned the hero visual as a **WebGL 3D scene** (`scripts/hero3d.js`) replacing the 2D
  oscilloscope: a stylized **bent-arm sleeve** (wireframe shell + fabric bands) carrying the
  **four circuit arrays** (11-14, colour-matched to the schematic/console — 12 amber, rest
  cyan), **TENS signal pulses** flowing down the limb, pulsing **electrode emitter rings**,
  over the engineering-grid motif. Gentle 3/4 sway + mouse parallax.
- Built with the installed **Three.js skill package** (scene-builder + renderer rules):
  imperative Three.js, transparent canvas, **unlit additive "HUD" look** (no lights, no
  post-processing), capped pixel ratio, `setAnimationLoop`, full dispose on `pagehide`.
- **Self-contained:** Three.js r169 vendored locally at `assets/vendor/three.module.js` and
  wired via a native **import map** — no CDN runtime dependency, still no build step.
- Accessibility/perf: `prefers-reduced-motion` renders a single static frame; the loop pauses
  off-screen (IntersectionObserver) and when the tab is hidden; responsive reframing for
  portrait/mobile. Verified in headless Chrome (SwiftShader): zero console errors, shaders
  compile clean, no horizontal overflow at 360/390px.
- Removed the now-dead 2D oscilloscope JS (`heroScope` IIFE) and its CSS (`.hero__scope`,
  `.electrode*`, `.hero__live`); kept `.live-dot` (still used by the ALIGNMENT LOCK readout).

### 2026-11-25 — Step 11: Merged `main` — kept the TENS vital-monitor hero (minus the two lines)
- Merged `main`, which had independently added an oscilloscope/vital-monitor hero
  (dual-channel TENS + piezo `<canvas>`, electrode emitters, LIVE chip + its CSS/JS).
  **Kept that hero visual**, but removed the "Live signal · dual-channel acquisition" chip
  and the "Dual-haptic pediatric pain platform" kicker (per client request) and applied the
  DreamSleeve rename to it. Pulled in main's `.gitignore` (ignore `.claude/`) and the
  hero-oscilloscope `scripts/main.js`. The live-dot now sits on the ALIGNMENT LOCK telemetry.

### 2026-11-25 — Step 10: Rename to DreamSleeve + hero cleanup
- **Renamed the brand to DreamSleeve** everywhere (matches the schematic's label): title,
  meta/keywords/author, Open Graph + Twitter, JSON-LD Org/Product, header/footer wordmark,
  hero lede, mailto CTAs, and docs. Placeholder domain `dreamsuit.com → dreamsleeve.com`
  (canonical, OG/Twitter image URLs, JSON-LD @id, `CNAME.disabled`, sitemap/robots, README).
  (The historical changelog line referencing the literal folder path is left as-is.)
- **Hero cleanup:** removed the eyebrow kicker ("Dual-haptic pediatric pain platform") and
  the "Live signal · dual-channel acquisition" readout — the hero now opens directly on the
  "Synchronized dual-haptic embodiment." headline. JSON-LD still valid.

### 2026-11-25 — Step 9: Engineering schematic in the Device section
- **Incorporated** the client's DreamSleeve anterior/posterior engineering schematic as
  `assets/schematic.png` (resized to 1600w) — placed as the Device section's lead figure
  above the live console, in a matching bordered panel with alt text + diegetic figcaption.
  The four schematic circuits (11 Biceps/Deltoid, 12 Triceps, 13 Posterior Forearm, 14
  Anterior Forearm) map 1:1 to the four circuits the live console reads.
- **Recreated the editable pieces as live SVG/HTML** (per client choice — vectorize the
  parts worth editing, keep the render for the arms):
  - **Fig. 02 — piezo actuator cross-section**: inline SVG layer stack (protective polymer →
    gold/ceramic/gold/ceramic/gold electrodes → flexible substrate) with a bending-displacement
    cue. All labels are editable text.
  - **Circuit index**: editable HTML table (circuit · muscle group · anterior/posterior view)
    with cyan/amber accent dots.
- Two-column detail block collapses to one column ≤920px; no horizontal overflow at 360–390px.

### 2026-11-25 — Step 8: Pediatric focus + Game & Regulatory sections
- **Reverted** an exploratory adult/GLP-1 "lifespan" broadening back to a **pediatric-only**
  focus, per client direction. Hero, meta, JSON-LD, mission, market all back to children.
- **New section — "Play the pathogen" (`#game`).** The gamified narrative made concrete:
  - Diegetic **Game Selector** panel that auto-scales the visual narrative + haptic texture
    profile by developmental age cohort (2–3 / 4–6 / 7–9 / 10+), active row highlighted.
  - **Pathogen game tiles** — Flu-Zilla (influenza), Corona Crusher (COVID-19), and a
    "one villain per vaccine" library card; titles tagged `[illustrative]`.
  - **Practice → Compete → Rank** flywheel: free home app (username) → harder device-linked
    version in-clinic → global/local **leaderboards**, with a diegetic leaderboard panel
    (mono rows, "you" row highlighted). Scores tagged `[placeholder]`.
- **New section — "Cleared to ship now" (`#pathway`).** Three-stage regulatory/commercial
  on-ramp: **Stage 01 NOW** — FDA General Wellness (clinics + home, LIVE); **Stage 02 NEXT** —
  RCT data → Class II clearance (IN TRIALS); **Stage 03 SCALE** — Medicaid EPSDT reimbursement
  + HSA/HRA DTC (PLANNED). Reuses the `.pill` vocabulary; added a `--plan` amber pill.
- **Footer legal rewritten** to the accurate General Wellness posture (not a cleared device;
  Class II / EPSDT described as planned pathways).
- Header + footer nav updated (Game, Pathway); keywords + Product JSON-LD enriched (gamified,
  General Wellness). New CSS appended; new grids collapse to 1 column ≤920px.
- Verified in headless Chrome (desktop): both sections on-brand, JSON-LD valid, tags balanced,
  all nav anchors resolve. No JS changes needed — new elements reuse `[data-reveal]`.
### 2026-11-25 — Step 1: Project scaffold & plan
- Established project in `DREAMSUIT - BRAND DESIGN AND UI/`.
- Confirmed direction with client: **investor-led**, CTA **"Request the investor deck"**,
  **custom domain** (`dreamsleeve.com` placeholder), **marked placeholders** for real data.
- Wrote `PLAN.md`: design-token system (neuro-tech HUD — void navy / cyan signal /
  magenta charge / pass green), type roles (Space Grotesk · Inter · IBM Plex Mono as
  diegetic telemetry), layout concept, section architecture, SEO kit, quality floor.
- Created `CHANGELOG.md` (this file).

### 2026-11-25 — Step 2: HTML structure + SEO
- Built `index.html`: header + hero + problem (single-modality trap) + science +
  device console + sticky mission + market + traction + ask + footer.
- Investor-led narrative; CTA = **Request the investor deck** (`mailto:` placeholder).
- Full meta: title/description/keywords, canonical, Open Graph, Twitter `summary_large_image`,
  theme-color, favicon/manifest links, and JSON-LD (`Organization` + `Product`).
- All unverifiable figures tagged `[placeholder]` inline.

### 2026-11-25 — Step 3: CSS design system
- `styles/main.css`: palette, type roles (Space Grotesk / Inter / IBM Plex Mono),
  fixed engineering-grid canvas + scroll progress rail, buttons, sticky header.
- Components: telemetry strip, trap grid, neon verdict bar, science pillars,
  device console (circuits + impedance + meters + safety pills), sticky mission,
  market moat + count-up stats, traction timeline, ask card, footer.
- Responsive breakpoints (920 / 560), full `prefers-reduced-motion` fallback, AA focus states.

### 2026-11-25 — Step 4: Scroll experience (JS)
- `scripts/main.js` (vanilla, no deps): IntersectionObserver reveals, rAF-throttled
  scroll loop, charging progress rail, count-up numbers, and the scroll-scrubbed
  **4-stage sticky mission sequence**. Reduced-motion + mobile static fallbacks.

### 2026-11-25 — Step 5: Brand assets
- `assets/favicon.svg` (cyan→magenta radiant node mark), rendered to `favicon-32.png`
  and `apple-touch-icon.png` (180), plus `og-image.png` (1200×630 social banner).
- Rendered from HTML/SVG via headless Chrome; `site.webmanifest` added.

### 2026-11-25 — Step 6: SEO infra + deploy files
- `sitemap.xml`, `robots.txt`, `CNAME` (dreamsleeve.com), `.nojekyll`, and `README.md`
  with GitHub Pages deploy steps + the placeholder-swap checklist.

### 2026-11-25 — Step 7: Review & polish
- Local preview + headless-Chrome screenshot review (desktop, mobile, mission at depth).
- **Fix:** mission panels overlapped into unreadable text during the crossfade. Reworked
  to opaque, z-indexed panels with an asymmetric transition (outgoing clears fast,
  incoming fades in delayed over its own background) + inner-content reveal. Verified
  stage/panel sync across all four phases. No horizontal overflow at 390px.

#### Open items for the client
- Confirm final domain; swap `dreamsleeve.com` + CTA email / deck link.
- Replace all `[placeholder]` figures and traction milestones with verified data.
- Optional: wire a form service if on-site email capture is desired.
