# CreatorPulse

A creator analytics dashboard concept for exploring content performance, engagement, and estimated earnings. The current experience uses **demo data**, not a live TikTok integration.

## Features

- Dashboard views for sample posts and audience trends.
- Views, likes, comments, shares, and engagement summaries.
- **Export CSV** downloads the three posts shown in the dashboard, with demo-source labels.
- CSV quoting preserves commas, quotes, and line breaks; formula-like titles are escaped for spreadsheet readers.

## Run locally

Requires Node.js 22+ and npm.

```sh
npm install
npm run dev
```

Open [localhost:3000](http://localhost:3000). The dashboard is at `/dashboard`.

## Verify

```sh
npm test
npx tsc --noEmit
npm run build
```

## Stack and limitations

Next.js, React, TypeScript, Tailwind CSS, and Recharts. Revenue values are illustrative estimates, not payment records. Official account connections and production authentication are not implemented.
