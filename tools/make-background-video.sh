#!/bin/bash
#
# make-background-video.sh
# Combines short MP4 clips into web-optimized background video loops
# for the Goods on Country website.
#
# Usage:
#   ./tools/make-background-video.sh <input-folder> [output-name] [duration]
#
# Examples:
#   ./tools/make-background-video.sh ~/Desktop/hero-clips hero
#   ./tools/make-background-video.sh ~/Desktop/product-clips stretch-bed 20
#   ./tools/make-background-video.sh ~/Desktop/process-clips process 30
#
# What it does:
#   1. Scans folder for all MP4/MOV/MKV files
#   2. Normalizes each clip (resolution, framerate, pixel format)
#   3. Concatenates clips with crossfade transitions
#   4. Strips audio (background videos are muted)
#   5. Outputs desktop (1080p) and mobile (720p) versions
#   6. Optimized for web: H.264, faststart, target ~5-10MB
#
# Requirements: ffmpeg (brew install ffmpeg)

set -e

# ================================================================
# CONFIG
# ================================================================
INPUT_DIR="${1:?Usage: $0 <input-folder> [output-name] [max-duration-seconds]}"
OUTPUT_NAME="${2:-background}"
MAX_DURATION="${3:-25}"
CROSSFADE_DURATION=1
OUTPUT_DIR="$(dirname "$0")/../deploy/video"
TEMP_DIR="/tmp/goods-video-build-$$"

# Target specs
DESKTOP_WIDTH=1920
DESKTOP_HEIGHT=1080
MOBILE_WIDTH=1280
MOBILE_HEIGHT=720
FPS=30
CRF_DESKTOP=23
CRF_MOBILE=26

# ================================================================
# HELPERS
# ================================================================
cleanup() {
  rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

info() {
  echo ""
  echo "  ▸ $1"
}

error() {
  echo ""
  echo "  ✗ ERROR: $1" >&2
  exit 1
}

# ================================================================
# VALIDATE
# ================================================================
command -v ffmpeg >/dev/null 2>&1 || error "ffmpeg not found. Install with: brew install ffmpeg"
command -v ffprobe >/dev/null 2>&1 || error "ffprobe not found. Install with: brew install ffmpeg"

[ -d "$INPUT_DIR" ] || error "Input directory not found: $INPUT_DIR"

# Find video files
shopt -s nullglob nocaseglob
VIDEO_FILES=("$INPUT_DIR"/*.{mp4,mov,mkv,avi,webm,m4v,MP4,MOV})
shopt -u nullglob nocaseglob

[ ${#VIDEO_FILES[@]} -gt 0 ] || error "No video files found in $INPUT_DIR"

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  Goods on Country - Background Video     ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Input:    $INPUT_DIR"
echo "  Clips:    ${#VIDEO_FILES[@]} files found"
echo "  Output:   $OUTPUT_NAME"
echo "  Max dur:  ${MAX_DURATION}s"

# ================================================================
# SETUP
# ================================================================
mkdir -p "$TEMP_DIR"
mkdir -p "$OUTPUT_DIR"

# ================================================================
# STEP 1: Normalize clips
# ================================================================
info "Normalizing ${#VIDEO_FILES[@]} clips to ${DESKTOP_WIDTH}x${DESKTOP_HEIGHT} @ ${FPS}fps..."

NORMALIZED_FILES=()
for i in "${!VIDEO_FILES[@]}"; do
  src="${VIDEO_FILES[$i]}"
  dst="$TEMP_DIR/clip_$(printf '%03d' "$i").mp4"

  echo "    $(basename "$src") → clip_$(printf '%03d' "$i").mp4"

  ffmpeg -y -i "$src" \
    -vf "scale=${DESKTOP_WIDTH}:${DESKTOP_HEIGHT}:force_original_aspect_ratio=increase,crop=${DESKTOP_WIDTH}:${DESKTOP_HEIGHT},fps=${FPS},format=yuv420p" \
    -an \
    -c:v libx264 \
    -preset fast \
    -crf 18 \
    -movflags +faststart \
    -t "$MAX_DURATION" \
    "$dst" 2>/dev/null

  NORMALIZED_FILES+=("$dst")
done

# ================================================================
# STEP 2: Concatenate with crossfades (if multiple clips)
# ================================================================
if [ ${#NORMALIZED_FILES[@]} -eq 1 ]; then
  info "Single clip - skipping concatenation"
  cp "${NORMALIZED_FILES[0]}" "$TEMP_DIR/combined.mp4"
else
  info "Concatenating ${#NORMALIZED_FILES[@]} clips with ${CROSSFADE_DURATION}s crossfades..."

  # Build complex filter for crossfade transitions
  FILTER=""
  INPUTS=""

  for i in "${!NORMALIZED_FILES[@]}"; do
    INPUTS="$INPUTS -i ${NORMALIZED_FILES[$i]}"
  done

  if [ ${#NORMALIZED_FILES[@]} -eq 2 ]; then
    # Simple 2-clip crossfade
    ffmpeg -y ${INPUTS} \
      -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE_DURATION}:offset=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${NORMALIZED_FILES[0]}" | awk -v cf=$CROSSFADE_DURATION '{printf "%.2f", $1 - cf}'),format=yuv420p[v]" \
      -map "[v]" \
      -c:v libx264 -preset fast -crf 18 \
      "$TEMP_DIR/combined.mp4" 2>/dev/null
  else
    # Multi-clip: use concat demuxer (simpler, still smooth)
    CONCAT_FILE="$TEMP_DIR/concat.txt"
    for f in "${NORMALIZED_FILES[@]}"; do
      echo "file '$f'" >> "$CONCAT_FILE"
    done

    ffmpeg -y -f concat -safe 0 -i "$CONCAT_FILE" \
      -c:v libx264 -preset fast -crf 18 \
      -movflags +faststart \
      "$TEMP_DIR/combined.mp4" 2>/dev/null
  fi
fi

# ================================================================
# STEP 3: Trim to max duration
# ================================================================
ACTUAL_DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TEMP_DIR/combined.mp4" | awk '{printf "%.0f", $1}')

if [ "$ACTUAL_DURATION" -gt "$MAX_DURATION" ]; then
  info "Trimming from ${ACTUAL_DURATION}s to ${MAX_DURATION}s..."
  ffmpeg -y -i "$TEMP_DIR/combined.mp4" \
    -t "$MAX_DURATION" \
    -c:v copy \
    "$TEMP_DIR/trimmed.mp4" 2>/dev/null
  mv "$TEMP_DIR/trimmed.mp4" "$TEMP_DIR/combined.mp4"
fi

# ================================================================
# STEP 4: Export desktop version (1080p)
# ================================================================
DESKTOP_OUT="$OUTPUT_DIR/${OUTPUT_NAME}-desktop.mp4"
info "Encoding desktop version (${DESKTOP_WIDTH}x${DESKTOP_HEIGHT}, CRF ${CRF_DESKTOP})..."

ffmpeg -y -i "$TEMP_DIR/combined.mp4" \
  -vf "scale=${DESKTOP_WIDTH}:${DESKTOP_HEIGHT}" \
  -an \
  -c:v libx264 \
  -preset slow \
  -crf "$CRF_DESKTOP" \
  -profile:v high \
  -level 4.1 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -metadata title="Goods on Country - ${OUTPUT_NAME}" \
  "$DESKTOP_OUT" 2>/dev/null

DESKTOP_SIZE=$(ls -lh "$DESKTOP_OUT" | awk '{print $5}')

# ================================================================
# STEP 5: Export mobile version (720p)
# ================================================================
MOBILE_OUT="$OUTPUT_DIR/${OUTPUT_NAME}-mobile.mp4"
info "Encoding mobile version (${MOBILE_WIDTH}x${MOBILE_HEIGHT}, CRF ${CRF_MOBILE})..."

ffmpeg -y -i "$TEMP_DIR/combined.mp4" \
  -vf "scale=${MOBILE_WIDTH}:${MOBILE_HEIGHT}" \
  -an \
  -c:v libx264 \
  -preset slow \
  -crf "$CRF_MOBILE" \
  -profile:v main \
  -level 3.1 \
  -pix_fmt yuv420p \
  -movflags +faststart \
  -metadata title="Goods on Country - ${OUTPUT_NAME}" \
  "$MOBILE_OUT" 2>/dev/null

MOBILE_SIZE=$(ls -lh "$MOBILE_OUT" | awk '{print $5}')

# ================================================================
# STEP 6: Generate poster frame
# ================================================================
POSTER_OUT="$OUTPUT_DIR/${OUTPUT_NAME}-poster.jpg"
info "Extracting poster frame..."

ffmpeg -y -i "$DESKTOP_OUT" \
  -vf "select=eq(n\,30)" \
  -vframes 1 \
  -q:v 2 \
  "$POSTER_OUT" 2>/dev/null

# ================================================================
# DONE
# ================================================================
FINAL_DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DESKTOP_OUT" | awk '{printf "%.1f", $1}')

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  Done!                                   ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Output files:"
echo "    Desktop:  $DESKTOP_OUT ($DESKTOP_SIZE)"
echo "    Mobile:   $MOBILE_OUT ($MOBILE_SIZE)"
echo "    Poster:   $POSTER_OUT"
echo ""
echo "  Duration: ${FINAL_DURATION}s"
echo ""
echo "  To use in HTML:"
echo ""
echo "    <video autoplay muted loop playsinline"
echo "           poster=\"video/${OUTPUT_NAME}-poster.jpg\">"
echo "      <source src=\"video/${OUTPUT_NAME}-desktop.mp4\""
echo "              media=\"(min-width: 768px)\" type=\"video/mp4\">"
echo "      <source src=\"video/${OUTPUT_NAME}-mobile.mp4\""
echo "              type=\"video/mp4\">"
echo "    </video>"
echo ""
