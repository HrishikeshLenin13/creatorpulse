# Troubleshooting creatorpulse

Use the smallest reproducible fixture before changing production data or configuration. Run commands from the repository root.

## Totals changed after typing in search

Cards summarize the visible subset intentionally. Clear the query to restore totals for all demo posts.

## The export contains fewer posts

The download reflects the current search and sort. Clear filters before exporting the full demo list.

## An earnings input yields zero

Negative, nonfinite, or overflowing estimates return zero. This does not validate real-world monetization eligibility or payment data.

## Reproduce and report

1. Record the exact command or UI action, runtime version, expected result, and actual result.
2. Run the regression command below on the same checkout and keep its first failure, not only the final summary.
3. Reduce the issue to a deterministic fixture without personal data or credentials.
4. Include the affected source path from the [feature guide](RECENT_IMPROVEMENTS.md) and whether it reproduces on a clean checkout.

```sh
npm test && npm run typecheck
```

## Recovery

Keep a copy of input data before experimenting. Revert the individual source change with Git and rerun the same fixture; a source revert does not automatically reverse browser storage, downloaded files, or external service state. Do not delete a lockfile or weaken a validation gate to make a failure disappear.
