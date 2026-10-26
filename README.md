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
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The dashboard is at `/dashboard`.

## Verify

```sh
npm test
npm run typecheck
npm run build
```

## Stack and limitations

Next.js 16, React 19, TypeScript, Tailwind CSS, and Recharts. Revenue values are illustrative estimates, not payment records. Official account connections and production authentication are not implemented.

## Dependency maintenance

The framework and React runtime are pinned in `package-lock.json` for reproducible installs. Next.js 16 no longer provides `next lint`; use the test, typecheck, and build commands above. The existing Tailwind 3 styling is retained rather than applying an untested CSS-framework migration.

## Developer resources

- [Feature usage and API contracts](docs/RECENT_IMPROVEMENTS.md)
- [Troubleshooting and recovery](docs/TROUBLESHOOTING.md)
- [Contributor checks and change review](docs/CONTRIBUTOR_CHECKLIST.md)
