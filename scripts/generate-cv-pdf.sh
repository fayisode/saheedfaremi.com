#!/usr/bin/env bash
# Build the site, then compile the static ATS-first LaTeX CV twice in a temporary
# directory. Only the verified two-page PDF is copied into the repository.
#
# Usage: ./scripts/generate-cv-pdf.sh (requires pdflatex and pdfinfo)
set -euo pipefail

SOURCE="src/lib/cv/saheed-faremi-cv.tex"
OUT="static/saheed-faremi-cv.pdf"
PDF="saheed-faremi-cv.pdf"

for command in pdflatex pdfinfo; do
	if ! command -v "$command" >/dev/null 2>&1; then
		echo "Error: $command is required to generate the CV PDF." >&2
		exit 1
	fi
done

npm run build

TEMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/saheed-cv.XXXXXX")"
trap 'rm -rf "$TEMP_DIR"' EXIT

for _ in 1 2; do
	pdflatex \
		-interaction=nonstopmode \
		-halt-on-error \
		-file-line-error \
		-output-directory="$TEMP_DIR" \
		"$SOURCE"
done

PAGES="$(pdfinfo "$TEMP_DIR/$PDF" | awk '/^Pages:/ {print $2}')"
if [[ "$PAGES" != "2" ]]; then
	echo "Error: expected a two-page CV, but pdfinfo reported ${PAGES:-unknown} pages." >&2
	exit 1
fi

cp "$TEMP_DIR/$PDF" "$OUT"
echo "Wrote $OUT (2 pages)"
