# Contributor checklist

## Before changing code

- Read the [feature contracts](RECENT_IMPROVEMENTS.md) and repository engineering instructions, when present.
- Reproduce the existing behavior with the regression command below before editing it.
- Choose one behavioral change and write down its input, output, error behavior, and compatibility impact.

## Project-specific review

- [ ] Do not present demo data or estimated revenue as connected provider analytics.
- [ ] Derive visible lists without mutating props or adding synchronization effects.
- [ ] Test table/card/export consistency and revoke download object URLs.

## Required checks

```sh
npm test && npm run typecheck
git diff --check
```

- [ ] A regression fixture fails for the old behavior and passes for the new behavior, or an invariant test independently checks the optimized result.
- [ ] Empty, malformed, boundary, and normal inputs have explicit expectations.
- [ ] Public examples and error descriptions match the actual exported names and exit statuses.
- [ ] Tests do not depend on personal paths, network responses, secret values, or wall-clock timing.
- [ ] Generated binaries, caches, dependencies, and private exports are absent from the staged diff.

## Submitting

Explain the user-visible outcome and affected source paths, include exact test commands/results, and note any additional browser or toolchain checks. Keep unrelated formatting and dependency upgrades separate. Inspect `git diff --cached` before committing. CI checks the repository contract; it is not proof of deployment, account integration, or production data correctness.
