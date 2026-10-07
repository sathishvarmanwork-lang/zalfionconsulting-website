# Zalfion Consulting website

The Zalfion Consulting website is built with Next.js, TypeScript, and Tailwind CSS. The current site includes the homepage, About Us, and Industries pages. It is available at [zalfionconsulting-website.vercel.app](https://zalfionconsulting-website.vercel.app).

## Run locally

```bash
npm install
npm run dev
```

Open http://127.0.0.1:3000.

`npm install` downloads the Satoshi and Switzer webfont files directly from Fontshare when they are missing. Their license does not permit distributing the font files through this repository. The download script requires the `unzip` command.

## Checks

```bash
npm run typecheck
npm test
npm run build
```

## Current scope

The booking interaction is a local demonstration. It does not reserve a time, send an invitation, or store form entries. Search indexing is disabled in the site metadata while the website is a preview.

The `/hometwo` route is an experimental design saved in the source tree and is not linked from the released pages.

## Main files

| Path | Purpose |
| --- | --- |
| `app/` | Routes and page styles |
| `components/` | Reusable and interactive components |
| `lib/` | Website content and assessment logic |
| `public/` | Images, fonts, and model assets used by the site |
| `tests/` | Application tests |

Internal design references and review artifacts are kept locally and are excluded from this public repository.
