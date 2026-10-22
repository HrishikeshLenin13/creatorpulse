#!/bin/sh
# Export the preserved baseline into a new directory or an explicitly marked test fixture.
# This script never checks out, resets, or deletes the active working tree.
set -eu
BASELINE=138d6b0cd23ac4a965462d98822acd9920a15092
EXPECTED=de3d50e2ae112e524c94e8ed11106c9fd49d483120a83f83e1f3dafd67fb6822
ROOT=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
TARGET=${1:?Usage: ROLLBACK.sh /absolute/path/to/new-directory}
case "$TARGET" in /*) ;; *) echo 'Use an absolute destination path.' >&2; exit 2;; esac
if [ -e "$TARGET" ]; then
  [ -d "$TARGET" ] && [ -f "$TARGET/.creatorpulse-rollback-fixture" ] || { echo 'Existing destination needs the .creatorpulse-rollback-fixture marker.' >&2; exit 2; }
else
  mkdir -p "$TARGET"
fi
DEST=$(CDPATH= cd -- "$TARGET" && pwd)
[ "$DEST" != "$ROOT" ] && [ "$DEST" != / ] || { echo 'Choose a separate snapshot directory.' >&2; exit 2; }
git -C "$ROOT" cat-file -e "$BASELINE^{commit}"
git -C "$ROOT" archive "$BASELINE" | tar -xf - -C "$DEST"
if command -v shasum >/dev/null 2>&1; then
  ACTUAL=$(shasum -a 256 "$DEST/app/api/analytics/route.ts" | awk '{print $1}')
else
  ACTUAL=$(sha256sum "$DEST/app/api/analytics/route.ts" | awk '{print $1}')
fi
[ "$ACTUAL" = "$EXPECTED" ]
printf 'ROLLBACK_OK baseline=%s analyzer_sha256=%s\n' "$BASELINE" "$ACTUAL"
