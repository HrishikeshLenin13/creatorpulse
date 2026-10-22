# CreatorPulse

A creator workspace for public TikTok and YouTube video links, clearly labeled sample analytics, local reports, and transparent revenue scenarios.

## What works

- **Real video lookup:** full TikTok links, TikTok short links (up to four validated redirects), YouTube watch links, Shorts, and `youtu.be` links.
- **Official public data:** oEmbed metadata and optional YouTube Data API statistics. Some current TikTok responses supply only an embed; the report states when a caption or creator profile was not returned. No fake statistics are substituted.
- **Reports:** optional video preview, evidence and limitations, JSON export, and up to 30 recent reports in browser-local storage. Reanalyzing a video replaces its saved snapshot; this is not historical tracking.
- **Sample analytics:** consistent aggregate counts, weighted engagement by views, UTC publication-window filtering, searchable and sortable content, expandable metric details, and CSV export. The sample dataset is explicitly anchored to October 22, 2026.
- **Revenue planner:** configurable eligible views and low/high USD RPM assumptions; a modeled range, not measured earnings.
- **Settings:** API-key configuration status, report export and confirmed local deletion.
- Responsive keyboard-accessible workspace, loading/error/empty states, request validation, and provider error handling.

## Run locally

Prerequisites: Node.js 22+ and npm. Tested on Node 26.8.1; CI targets Node 22.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open [the local workspace](http://localhost:3000/dashboard) or [video analyzer](http://localhost:3000/dashboard/analyzer). No account or API key is needed for public metadata.

For a production build:

```sh
npm run build
npm start
```

Next.js 16.4.2, React 19.3.1, strict TypeScript, and plain CSS. Webpack is selected explicitly for consistent dev/build behavior. The original unused Tailwind and Recharts dependencies were removed; small charts render directly in the DOM. This reduced the dependency surface while fixing the original failed production build.

## Optional YouTube statistics

1. Create a project in Google Cloud.
2. Enable **YouTube Data API v3** and create a restricted API key.
3. Set `YOUTUBE_API_KEY` in `.env.local` or your deployment's server-side environment, then restart the server.
4. Restrict the key to YouTube Data API and appropriate deployment restrictions. Never add a `NEXT_PUBLIC_` prefix.

The server calls `videos.list` for `snippet,statistics`. Views, likes, or comments may be unavailable/hidden; missing values remain `null`, not zero. Interaction rate is `(likes + comments) / views × 100` and explicitly excludes shares. If the statistics request fails, genuine public metadata remains available with a visible explanation. A configured key is not proof of a successful API connection.

Official references: [YouTube videos.list](https://developers.google.com/youtube/v3/docs/videos/list), [TikTok embed videos](https://developers.tiktok.com/doc/embed-videos/).

## TikTok and cloud-account status

TikTok public oEmbed does **not** supply private performance analytics. It may omit even title/author metadata for an otherwise embeddable video. The app supports that response without inventing metadata. Deleted, private, region-restricted, or unavailable videos can still fail. Short links that do not resolve to an approved public video URL receive instructions to paste the full URL.

**Not implemented:** TikTok OAuth, account-level synchronization, cloud login, cloud storage, audience/retention analytics, payouts, AI audiovisual analysis, video uploads, background jobs, team accounts, and billing. The old fake authentication endpoints now fail closed with HTTP 503 and never issue placeholder tokens. Login/signup pages explain public mode and collect no passwords.

An approved TikTok app and appropriate permissions, OAuth state/PKCE flow, encrypted token storage, a real identity provider, and tenant-isolated persistent storage are prerequisites for future private analytics. No database was added merely to persist static demo data. Reports stay in this browser, are visible to anyone sharing its profile, and disappear if site storage is cleared.

## Environment

| Variable          | Required | Purpose                                                                     |
| ----------------- | -------- | --------------------------------------------------------------------------- |
| `YOUTUBE_API_KEY` | No       | Server-only public statistics; requires API enablement and remaining quota. |

No other credentials are required. Do not commit `.env.local` or real keys. See [architecture and boundaries](docs/ARCHITECTURE.md).

## Quality checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run test:e2e
npm audit --omit=dev
```

The browser suite starts a production server, so build first. It runs desktop and mobile Chromium flows covering navigation, filtering, search, details, CSV/JSON exports, analyzer failure/success, local report persistence/deletion, revenue validation, and automated WCAG AA scans. UI success tests use deterministic API fixtures; provider/route integration tests separately exercise the real parsing pipeline with mocked upstream responses. Ordinary CI requires no credentials. Live-provider observations and release limitations are recorded in [the verification report](evidence/VERIFICATION.txt).

## Deploy

Deploy as a Node-compatible Next.js application (for example Vercel or a Node container), not a static export. Build with `npm ci && npm run build`; start a self-hosted Node deployment with `npm start`. Add the optional YouTube key as a server secret and redeploy. Public links need outbound HTTPS to fixed official endpoints. Verify `/api/health`, the analyzer with a known public video, security headers, error behavior, and API quota on the actual deployed host. No deployment is claimed by this repository's local checks.

Before broad public traffic, add edge/distributed rate limiting and request-body/time limits. The included 60 requests/minute + six active requests limiter is process-local and resets on restart; it is a circuit breaker, not user-level abuse protection. No tokens or private user data are stored server-side, and responses use `Cache-Control: no-store`.

## Security and remaining work

- Exact HTTPS platform-host allowlist; user input is never fetched as an arbitrary URL. Only approved TikTok short hosts are fetched directly, with manual redirect revalidation.
- Bounded provider response sizes, timeouts, safe JSON errors, no injected provider HTML, React-escaped strings, no client-side secrets, formula-neutralized CSV cells, and security headers.
- CSP permits inline scripts/styles for Next.js; a nonce-based policy remains future hardening. External video players load only after a click and connect directly to the platform.
- `npm audit --omit=dev` reports no production advisories at verification time. Full audit reports five development-only findings through Next's ESLint plugin → fast-glob → micromatch → braces. The registry currently offers no patched braces release; lint globs are fixed repository inputs, not user submissions. ESLint 9 is retained because the bundled React/import/accessibility plugins do not all support ESLint 10 yet. Recheck on dependency updates.
- Automated accessibility tests are not a substitute for assistive-technology and human usability testing.

For a suspected vulnerability, contact the repository owner privately through their GitHub profile, share reproduction steps without secrets, and avoid posting private video/account data in a public issue.

## Reversal

The original source commit is `138d6b0cd23ac4a965462d98822acd9920a15092`. `evidence/ROLLBACK.sh` exports that Git object into a **new empty directory**, verifies the baseline analyzer hash, and leaves the changed workspace intact. Reversing changes on a shared Git branch should use reviewed revert commits rather than rewriting `main`.
