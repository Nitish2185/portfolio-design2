# Lorem Ipsum — Animated Portfolio

A loud, animation-heavy personal portfolio. All text is **lorem ipsum placeholder**, so you can swap in your own details whenever you're ready.

**Stack:** Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · GSAP + ScrollTrigger + SplitText · Motion · Lenis · Three.js

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Make it yours

Almost everything you'll want to change is in **one file: [`src/content/site.ts`](src/content/site.ts)**.

| What | Where |
| --- | --- |
| Name, role, tagline, email, location, time zone | `site` in `src/content/site.ts` |
| Menu links and social links | `navLinks`, `socials` |
| About text and the four stats | `about` |
| Services cards | `services` |
| Projects (also creates `/work/<slug>` pages) | `projects` |
| Jobs timeline | `experience` |
| Skill blocks | `skills` |
| Quotes and client names | `testimonials`, `clients` |
| Résumé download | replace `public/resume.pdf` |
| Colours and fonts | `src/app/globals.css` (`@theme`) and `src/app/layout.tsx` |

**Your photo:** the portrait in `src/components/sections/About.tsx` is a coloured placeholder. Put an image in `public/` and replace the placeholder block with a `next/image` `<Image>`.

**Project images:** project covers are generated art (`src/components/ui/ProjectCover.tsx`). Swap them for real screenshots the same way.

**Contact form:** there's no server. Submitting opens the visitor's email app with the message filled in. To receive messages directly, point the form at a service such as Formspree or a Next.js Server Action.

## What moves, and how

| Part | Effect | Built with |
| --- | --- | --- |
| Intro | 000→100 counter, rolling words, two-layer curtain reveal (shorter on repeat visits) | GSAP |
| Smooth scroll | Inertia scrolling synced to every scroll animation | Lenis + GSAP ticker |
| Cursor | Blend-mode dot and ring, magnetic buttons, "View / Drag" badges | GSAP `quickTo` |
| Hero | Shader-displaced iridescent 3D blob that follows the mouse, erupts on click, warps on scroll; letters rise in and fly apart | Three.js + GSAP SplitText |
| Marquee | Crossing tapes that speed up, reverse and skew with scroll speed | GSAP ScrollTrigger |
| About | Words light up as you scroll, portrait wipes in, counters count up | GSAP |
| Work | Pinned horizontal scroll, cards swing in, 3D tilt with glare | GSAP + Motion |
| Services | Sticky card deck that settles back, looping glyphs | GSAP + Motion |
| Experience | Rows flood with colour, a preview card follows the cursor | Motion + GSAP |
| Skills | Blocks drop in and can be dragged and thrown | Motion drag |
| Testimonials | Word-by-word quote slider with auto-advance | Motion `AnimatePresence` |
| Contact | Bouncing letters, copy-email toast, animated form | Motion |
| Footer | Revealed from under the page, name rises letter by letter | GSAP |
| Page changes | Wave curtain showing the next page's name | Motion |

Visitors with **"reduce motion"** turned on in their operating system get a calm version: no intro, no looping marquee, a still 3D scene and instant text.

## Project layout

```
src/
  app/                 pages, layout, global styles, 404
    work/[slug]/       case-study pages
  components/
    sections/          one file per page section
    layout/            Nav, Menu, Footer
    providers/         smooth scroll, page transitions, Motion config
    three/             Three.js hero scene and shaders
    ui/                reusable pieces (cursor, buttons, text reveals…)
  content/site.ts      all placeholder content
  lib/                 GSAP setup, scroll and intro helpers
```

## Deploy

Push to GitHub and import the repo on [Vercel](https://vercel.com/new); no extra settings are needed.
