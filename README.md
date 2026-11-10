# Zap’s portfolio

Next.js App Router, TypeScript, and Tailwind CSS. A static, single-page portfolio with a dark theme. No application backend or database.

## Run

```sh
npm install
npm run dev
```

Checks: `npm run lint` and `npm run build`. Deploy the generated `out/` directory to static hosting.

## Personalize

- Edit copy, metadata, skills, experience, and URLs in `src/data/profile.ts`.
- The CV button requests a copy by email. The public PDF was removed because it contained private contact details.
- DeltaDrop and Manabeat are the two featured projects. AICMS is mentioned only in the X.inc timeline entry.
- Project images are in `public/projects`; edit their paths and alt text in the profile data.
- Favicon: `src/app/icon.svg`.
- Set `NEXT_PUBLIC_SITE_URL` to your deployed origin before building so social-sharing image URLs use your domain.

The page, root layout, and social-sharing image use three React files. Styling lives in `src/app/globals.css`.
