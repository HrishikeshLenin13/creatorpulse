# Architecture and data boundaries

## Original audit

The original Next.js 14 / React 18 App Router project had static dashboard components, a mock analytics function, no database, and no real identity provider. The production build failed on a duplicate `ok` field in the analytics response. URL validation was a substring check; every accepted link returned the same invented creator statistics. The login/signup API minted constant tokens and the forms were inert. Global CSS was not imported by the root layout. Tabs, filters, export actions, and most sidebar destinations did not perform their advertised actions.

## Implemented structure

- `app/`: server page shells and standard Node-runtime route handlers. `/dashboard/[view]` accepts only the four supported workspace views.
- `components/Workspace.tsx`: interactive workspace composition, settings, reports, and scenario modeling. `AnalyticsDashboard.tsx` handles explicitly sampled analytics; `VideoAnalyzer.tsx` handles live reports and never mixes them with sample aggregates.
- `lib/video-url.ts`: strict canonicalization and input errors. Only HTTPS, no credentials/custom ports, exact platform hosts, validated IDs/paths, no tracking parameters.
- `lib/providers/public-video.ts`: fixed official provider endpoints, bounded stream reading, timeout signals, explicit short-link redirect validation, and optional YouTube statistics. Provider functions accept an injected `fetcher` for deterministic tests. Only real returned fields are measured; URL-derived handles and missing metadata are disclosed.
- `lib/metrics.ts`: formulas and denominator/error handling. No arbitrary engagement multiplier is applied to revenue.
- `lib/request.ts`: maximum 4 KiB inbound JSON body and process-local concurrency/rate circuit breaker. Cross-origin browser analysis POSTs are rejected; browser fetch metadata is not treated as authentication.
- `lib/report-store.ts`: validated local storage schema and `useSyncExternalStore` subscription. Up to 30 snapshots, deduplicated by platform/video ID. No account-level or historical persistence claim.
- `lib/export.ts`: browser-initiated downloads and CSV formula mitigation.
- `tests/`: Node unit/API tests and production-server Playwright desktop/mobile workflows. Upstream fixtures do not imply a real integration was contacted.

## Scope of data

A real video report contains its canonical URL/ID, real provider metadata when supplied, source, fetch timestamp, optional measured YouTube statistics, simple caption observations, and limitations. Video frames/audio are never downloaded or analyzed. Report metadata is forwarded to the originating platform and stored in the requesting browser, not in a server database. The API key stays in server environment variables. Embedding is opt-in and gives the platform the usual player request metadata.

Sample metrics use a separate deterministic dataset and a fixed UTC reference date. Chart bars mean lifetime views for posts published on the indicated dates, not daily growth history. No follower history, payout ledger, retention curve, or audience demographics are synthesized. Revenue is an explicit USD scenario using eligible views and configurable RPM.

## Operational boundaries

The Node server must have outbound HTTPS access. Real video availability, embedding policy, regions, quota, and short-link behavior are controlled by the platforms. Each provider request has a timeout, and successful metadata survives an optional statistics failure. No failed lookup produces a fictional report.

Single-process rate limiting is intentionally simple; deploy a distributed/edge limiter before anonymous public scaling. Platform DNS is trusted for an exact allowlist of official domains; arbitrary user hostnames and redirect destinations are never requested. Provider HTML is discarded, not sanitized and injected. The fixed player URL is composed from a validated numeric or YouTube video ID.

No private account resources exist yet. Adding account integration requires genuine authentication, ownership checks on every read/write, encrypted credentials, durable relational storage with migrations, idempotent snapshot sync, operational monitoring, and platform approval. A pretend OAuth callback or password store would not improve this public-link release.
