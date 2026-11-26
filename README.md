# DreamSleeve — Investor/Customer Site

A single-page, dependency-free static site for **DreamSleeve**, the synchronized
dual-haptic wearable for pediatric procedural pain — a gamified vaccine experience
(kids defeat the pathogen the shot protects against), shipping under FDA General
Wellness with a path to Class II clearance and Medicaid EPSDT reimbursement.
Built to deploy on GitHub Pages with no build step.

## Structure
```
index.html          # the whole page + SEO/OG/JSON-LD
styles/main.css     # design system (neuro-tech HUD)
scripts/main.js     # scroll experience + live telemetry (vanilla JS)
assets/
  hero-arm.jpg      # hero photo — arm wearing the sleeve with wireframe overlay
  schematic.png     # DreamSleeve engineering schematic (Device section)
site.webmanifest    # PWA manifest
sitemap.xml robots.txt CNAME .nojekyll
PLAN.md CHANGELOG.md
```

**Hero:** a photographic arm wearing the sleeve (black fabric + glowing cyan wireframe
overlay), `assets/hero-arm.jpg`, anchored on the right and vignette-masked (CSS `mask-image`)
so it dissolves into the void background behind the left-aligned headline. A subtle CSS
drift + brightness pulse keeps the wireframe feeling "live"; both are disabled under
`prefers-reduced-motion`. No JS, no dependencies, no build step. (An earlier WebGL/Three.js
3D hero was replaced by this photographic treatment for a hyper-realistic look.)

## Deploy to GitHub Pages
1. Create a repo and push these files to the default branch (root, not `/docs`).
   ```bash
   git init && git add . && git commit -m "DreamSleeve site"
   git branch -M main
   git remote add origin git@github.com:<you>/<repo>.git
   git push -u origin main
   ```
2. Repo **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   branch `main` / root. `.nojekyll` is included so Pages serves files as-is.
3. **Custom domain:** `CNAME` is set to `dreamsleeve.com`. In Settings → Pages, enter the
   same domain and add these DNS records at your registrar:
   - `A` records for the apex → GitHub Pages IPs (185.199.108–111.153)
   - or a `CNAME` for `www` → `<you>.github.io`
   Enable **Enforce HTTPS** once the cert provisions.

## Before you publish — fill in the INFO NEEDED fields
Search the repo for these and replace with real values:
- **Domain** `dreamsleeve.com` → your domain, in: `index.html` (canonical, OG, Twitter,
  JSON-LD), `CNAME`, `robots.txt`, `sitemap.xml`, `site.webmanifest`.
- **Email** `invest@dreamsleeve.com` / `hello@dreamsleeve.com` in `index.html` (the two CTAs
  and the contact line). Or point the primary CTA at a deck link / data-room URL.
- **`INFO NEEDED` fields** — the **Team** section (founder/advisor names, roles, bios), the
  traction milestones, the leaderboard season score, and the deck-request email. Each is
  tagged with a magenta `INFO NEEDED` mark; search `index.html` for `INFO NEEDED` to find
  them all. (The `[titles illustrative]` and `[status: pre-submission]` tags are clarifiers,
  not missing data.) The Market stats are now real, sourced figures — see the `<i>` source
  tags (WHO / CDC 2025 / 2019 meta-analysis); swap in your own bottom-up TAM if preferred.
- **Lead-capture form (Formspree)** — the Ask section has an on-site capture form. To turn it
  on: create a form at [formspree.io](https://formspree.io), copy its endpoint, and replace
  `YOUR_FORM_ID` in the `<form action="https://formspree.io/f/YOUR_FORM_ID">` in `index.html`.
  Until then the form shows a "not connected yet" message instead of submitting. It posts via
  AJAX (name, email, organization, interest, message) and shows an inline success/error state,
  so the visitor never leaves the page. Swap the deck itself for a Docsend/Notion/data-room link
  in the success flow or the confirmation email if you prefer.

## Regenerating the social banner / icons
The OG image and icons were rendered from HTML/SVG with headless Chrome. Source templates
live in the project scratchpad; the committed outputs are in `assets/`. To re-render, open
`assets/favicon.svg` or the OG template in a browser at 1200×630 and export, or re-run the
headless-Chrome screenshot step.

## Accessibility & performance
Responsive to mobile · keyboard-focusable · `prefers-reduced-motion` respected ·
AA contrast · no JS framework, no layout-shift (fonts preconnected + `display=swap`).
