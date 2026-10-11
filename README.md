# Ridham Mehta — Talking-Video Portfolio

Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · Lenis.
All copy lives in `src/lib/data.ts` and comes from the résumé.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build && npm start
```

Set `NEXT_PUBLIC_SITE_URL` in production so Open Graph URLs are absolute.

## Sections

| # | id | Component | Interaction |
|---|----|-----------|-------------|
| – | `top` | `hero/Hero.tsx` | Looping intro video, sound toggle, pauses when < 35 % visible |
| 01 | `about` | `sections/About.tsx`, `ui/IdCard.tsx` | Pendulum lanyard ID card, flips on hover / tap / Enter |
| 02 | `skills` | `sections/Skills.tsx` | Periodic-table tiles, family filter, logo inspector |
| 03 | `work` | `sections/Work.tsx`, `ui/MiniUI.tsx` | Expanding accordion, illustrative CSS UIs |
| 04 | `experience` | `sections/Experience.tsx` | Scroll-drawn timeline |
| 05 | `contact` | `sections/Contact.tsx` | Hop-on-hover heading, copy-email chip |

Certifications and Achievements are not rendered: the résumé has no such data.
Add typed `CERTIFICATIONS` / `ACHIEVEMENTS` arrays to `data.ts` and a section to enable them.

## Rebuild the hero video

Requires `ffmpeg` (libx264, libvpx-vp9, libopus), `numpy`, `Pillow`.

```bash
python3 scripts/build-hero-assets.py path/to/intro.mp4 \
  --crop 640:1280:40:0 --bust-box 150,20,590,570 --bust-time 2.0
```

Outputs `public/hero/hero.{mp4,webm}`, `public/portrait-bust.webp`, `public/og.jpg`.
The loop cross-fades the last 0.5 s into the first 0.5 s (video via `xfade`, audio equal-power in numpy).
Pass `--photo front.jpg` to build the ID-card portrait from a photo instead of a video frame.

## Credits

Brand logos are devicon "original" SVGs (MIT, see `public/logos/LICENSE-devicon.txt`).
Brand names and marks belong to their respective owners.
Fonts (self-hosted via `@fontsource`): Inter Tight, Instrument Serif, JetBrains Mono — SIL OFL 1.1.
