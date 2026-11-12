# Aung Aung’s portfolio

Next.js App Router, TypeScript, and Tailwind CSS. A static, single-page portfolio with an Editorial Rails design, a scroll-snap case-study showcase, dark and light themes, and self-hosted fonts. No application backend or database.

## Run

```sh
npm install
npm run dev
```

Checks: `npm run lint` and `npm run build`. Deploy the generated `out/` directory to static hosting.

## Personalize

- Edit copy, metadata, skills, experience, and URLs in `src/data/profile.ts`.
- The CV buttons download `public/cv.pdf`. This is the approved CMC Global CV; Astranokta is May–August 2026, contract completed. Replace the file when updating the CV.
- Manabeat is the main case study, followed by DeltaDrop. AICMS is mentioned only in the X.inc timeline entry.
- Project images are in `public/projects`; edit their paths and alt text in the profile data.
- Favicon: `src/app/icon.svg`.
- `profile.metadata.url` holds the production origin for canonical and social-sharing URLs. It is set to `https://aung-aung-dev-6nccj.ondigitalocean.app` and cannot be overridden with a localhost environment variable.

The page, root layout, social-sharing image, and small interaction controller use four React files. Styling lives in `src/app/globals.css`. Newsreader and Instrument Sans are self-hosted in `public/fonts` with their OFL licenses. The theme choice is saved locally. The showcase supports arrow keys, buttons, and native touch scrolling; reduced-motion preferences disable animated slide transitions and reveals. Experience entries use native disclosures with an expand-all control, and the contact section includes email copying.
