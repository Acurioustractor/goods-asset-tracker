#!/usr/bin/env bash
# Converts a drone master into the small muted loop the pitch pins behind chapter 2, plus its
# poster. Run from anywhere; the sandbox cannot read external volumes, so Ben runs this himself:
#
#   bash v2/scripts/convert-drone-clip.sh "/Volumes/BenjaminK/Jobs/Orange Sky/OS_Kalgoorlie/OS Kalgoorlie/Video/Drone/DCIM/101MEDIA/DJI_0112.MP4"
#
# Optional second and third arguments: start offset (seconds) and length (seconds); defaults 0 and 14.
# Output: 1280 px wide, 24 fps, H.264 CRF 28, no audio, faststart, usually 2 to 4 MB.
set -euo pipefail
SRC="${1:?path to the drone .MP4}"
START="${2:-0}"
LEN="${3:-14}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT_DIR="$HERE/public/video/kalgoorlie"
mkdir -p "$OUT_DIR"
ffmpeg -y -hide_banner -loglevel error -ss "$START" -t "$LEN" -i "$SRC" \
  -vf "scale=1280:-2,fps=24" -an -c:v libx264 -crf 28 -preset slow -pix_fmt yuv420p -movflags +faststart \
  "$OUT_DIR/ninga-mia-drone.mp4"
ffmpeg -y -hide_banner -loglevel error -ss "$START" -i "$SRC" -frames:v 1 -vf "scale=1600:-2,format=yuvj420p" -strict unofficial -q:v 4 \
  "$OUT_DIR/ninga-mia-drone-poster.jpg"
ls -la "$OUT_DIR"
echo "Done. Reload http://localhost:3011/pitch: chapter 2 now pins the film."
