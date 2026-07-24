# ChirayuOS Portfolio

Interactive desktop-style portfolio for Chirayu Mishra, built with Next.js, React, TypeScript, Tailwind CSS, Zustand, Prisma, and Framer Motion.

The project presents portfolio content as a browser-based OS shell with apps for profile highlights, verified projects, skills, experience, resume, contact, GitHub activity, source browsing, terminal commands, settings, media, and mini games.

## Features

- Desktop shell with draggable, resizable, minimizable app windows
- Recruiter-friendly first run with boot skip and profile highlights opened by default
- Central typed portfolio content layer in `data/portfolio.ts`
- Verified flagship project content and conservative fallback data
- Contact form backed by Prisma and optional SMTP delivery
- GitHub profile/repository API integration with safe offline fallback
- Resume viewer and PDF download flow
- Command palette, terminal shortcuts, achievements, notifications, themes, and settings
- Visible keyboard focus and reduced-motion support

## Screenshots

Recommended screenshots to capture before publishing:

- Desktop first-run view with Profile Highlights open
- Projects Explorer showing the ChirayuOS project
- Resume viewer
- Contact app
- GitHub dashboard with a configured `GITHUB_TOKEN`

Store screenshots under `public/screenshots/` and reference them here when available.

## Tech Stack

- Next.js 14 App Router
- React 18
- TypeScript
- Tailwind CSS
- Zustand
- Prisma + SQLite for local contact message storage
- Nodemailer for optional SMTP notifications
- Framer Motion, Monaco Editor, xterm-style terminal UI

## Getting Started

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Environment Variables

Create `.env.local` for optional integrations:

```bash
GITHUB_TOKEN=
GEMINI_API_KEY=
SMTP_HOST=
SMTP_USER=
SMTP_PASS=
CONTACT_RECEIVER=
```

Notes:

- Without `GITHUB_TOKEN`, the GitHub dashboard uses conservative fallback data.
- Without `GEMINI_API_KEY`, ChirayuAI returns an offline contact message.
- Without SMTP variables, contact messages are saved to local SQLite only.

## Verification

Run lint:

```bash
npm run lint
```

Run TypeScript validation:

```bash
npx tsc --noEmit
```

Run a production build:

```bash
npm run build
```

## Deployment Notes

- Vercel is the simplest deployment target for this Next.js app.
- Add production environment variables in the hosting dashboard.
- The local SQLite database is suitable for development. For production message persistence, migrate Prisma to a hosted database.
- Keep portfolio claims verified; hide unavailable social/demo links instead of linking to placeholders.
