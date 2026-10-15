# iWILL 'til I'm Well × NNVA — Landing Page

Affiliate / partner landing page for the iWILL 'til I'm Well partnership with the
**National Neurodivergent Veterinary Alliance (NNVA)**. NNVA members unlock
negotiated member pricing on virtual medical and behavioral healthcare for
neurodivergent veterinary professionals and their families.

Built with Next.js (App Router) + Tailwind CSS and deployed as a static export.
It shares the layout of the HopperVets partner page and takes its color cues,
fonts, pill buttons, and logo from [ndvetalliance.org](https://ndvetalliance.org/).

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the page.

## Build

```bash
npm run build
```

`next.config.ts` uses `output: 'export'`, so the build emits a static site to
`out/`.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4 (design tokens in `src/app/globals.css`)
- Page sections live in `src/components/` (the `retail/` folder holds the
  partnership page sections); the page is composed in `src/app/page.tsx`.

## Affiliate code

The NNVA affiliate code is **`NNVAWELL01`**. See `INTEGRATION.md` for where it is
referenced and how to wire the lead form.
