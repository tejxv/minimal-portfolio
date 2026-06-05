#!/usr/bin/env bash
# Compress a .glb for the web: draco geometry + webp textures, no mesh
# simplification (preserves hard-surface edges). Outputs into public/models.
#
# Usage:
#   ./scripts/compress-glb.sh <input.glb> <out-name>
#   ./scripts/compress-glb.sh ~/Downloads/sony_a7.glb sony-a7
#
# The out-name must match the GearItem id in app/components/gear/items.ts so the
# data points at /models/<out-name>.glb.
set -euo pipefail

if [ "$#" -ne 2 ]; then
  echo "usage: $0 <input.glb> <out-name>" >&2
  exit 1
fi

IN="$1"
NAME="$2"
DEST_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/models"
OUT="$DEST_DIR/$NAME.glb"

mkdir -p "$DEST_DIR"

npx --yes @gltf-transform/cli@latest optimize "$IN" "$OUT" \
  --compress draco \
  --texture-compress webp \
  --simplify false

echo "✓ wrote $OUT"
ls -lh "$OUT"
