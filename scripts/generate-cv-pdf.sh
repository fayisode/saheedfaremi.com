#!/usr/bin/env bash
# Regenerate the downloadable CV PDF from the live /cv page so it never drifts
# from the site's structured content. Renders the default (research) track with
# the print stylesheet, which strips nav/footer/canvas/track-selector.
#
# Usage: ./scripts/generate-cv-pdf.sh   (run from repo root; needs Google Chrome)
set -euo pipefail

PORT="${PORT:-4178}"
OUT="static/saheed-faremi-cv.pdf"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"

npm run build

npm run preview -- --port "$PORT" >/tmp/cv-preview.log 2>&1 &
PREVIEW_PID=$!
trap 'kill "$PREVIEW_PID" 2>/dev/null || true' EXIT

# Wait for the preview server to answer on /cv
for _ in $(seq 1 30); do
	if curl -fs -o /dev/null "http://localhost:${PORT}/cv"; then break; fi
	sleep 0.5
done

"$CHROME" --headless --disable-gpu --no-pdf-header-footer \
	--print-to-pdf="$OUT" "http://localhost:${PORT}/cv"

echo "Wrote $OUT"
