# 🪔 Happy Diwali — The Fun Way

A universal, funny, interactive Diwali greeting. One link, works for anyone — no names, no forms, no tracking.

**Stack:** Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS · Lucide React. Fully client-side: no backend, database, auth or environment variables.

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. In Vercel: **Add New → Project → import the repo → Deploy.**

That's it — Vercel auto-detects Next.js. The site URL for link previews (Open Graph) is picked up automatically from Vercel's built-in system variables, so there is nothing to configure.

> After the first deploy, open your link in WhatsApp once to check the preview. If you change the preview image later, WhatsApp may cache the old one for a while.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

## Customise

| What | Where |
| --- | --- |
| All wishes (classic / corporate / savage), the main card text, mission list | `lib/wishes.ts` |
| Colours, buttons, diya + ember animations | `app/globals.css` |
| Page title, description, social metadata | `app/layout.tsx` |
| Link-preview image (1200×630) | `app/opengraph-image.tsx` |
| Favicon | `app/icon.svg` |
| Fireworks / confetti | `components/Fireworks.tsx` |

## Notes

- **Mobile-first**: large touch targets, no horizontal scroll, `dvh` units and safe-area insets for iOS.
- **Performance**: fireworks run on one capped canvas (DPR ≤ 2, particle limits, fewer on small screens) and pause when idle. Fonts are self-hosted via `@fontsource` — no external font requests.
- **Accessibility**: respects `prefers-reduced-motion` (animations collapse, typing is instant, confetti is skipped, fireworks shrink). A sound toggle is always visible; sounds are tiny synthesized effects and only play after a tap.
- **Privacy**: nothing is collected or stored. WhatsApp sharing uses a plain `wa.me` link.

Made with 🪔 ❤️ and questionable amounts of caffeine.
