#!/bin/bash
#
# extract-segments.sh
# Extracts specific segments from a source video and assembles them
# into a web-ready background video with crossfades.
#
# Usage:
#   ./tools/extract-segments.sh <video-file> <output-name> <segments>
#
# Segments format: "start-end,start-end,start-end" (in seconds)
#
# Examples:
#   ./tools/extract-segments.sh media/raw/pitch.mp4 hero "5-10,25-32,45-52"
#   ./tools/extract-segments.sh media/raw/tour.mp4 process "12-20,35-45,60-70"
#   ./tools/extract-segments.sh media/raw/community.mp4 stretch-bed "0-8,15-22"
#
# What it does:
#   1. Extracts each segment from the source video
#   2. Normalizes all segments (resolution, framerate)
#   3. Applies crossfade transitions between segments
#   4. Strips audio
#   5. Outputs desktop (1080p) + mobile (720p) + poster
#   6. Files go to deploy/video/ ready for the website
#
# Requirements: ffmpeg (brew install ffmpeg)

set -e

# ================================================================
# CONFIG
# ================================================================
INPUT_FILE="${1:?Usage: $0 <video-file> <output-name> <segments>}"
OUTPUT_NAME="${2:?Usage: $0 <video-file> <output-name> <segments>}"
SEGMENTS="${3:?Usage: $0 <video-file> <output-name> <segments>  (segments: \"5-10,25-32,45-52\")}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
OUTPUT_DIR="$SCRIPT_DIR/../deploy/video"
TEMP_DIR="/tmp/goods-extract-$$"

# Target specs
DESKTOP_WIDTH=1920
DESKTOP_HEIGHT=1080
MOBILE_WIDTH=1280
MOBILE_HEIGHT=720
FPS=30
CRF_DESKTOP=23
CRF_MOBILE=26
CROSSFADE=1

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
[ -f "$INPUT_FILE" ] || error "Video file not found: $INPUT_FILE"

# Parse segments
IFS=',' read -ra SEGMENT_LIST <<< "$SEGMENTS"
[ ${#SEGMENT_LIST[@]} -gt 0 ] || error "No segments provided"

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  Goods on Country - Segment Extractor    ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Source:     $(basename "$INPUT_FILE")"
echo "  Output:     $OUTPUT_NAME"
echo "  Segments:   ${#SEGMENT_LIST[@]}"

for i in "${!SEGMENT_LIST[@]}"; do
  seg="${SEGMENT_LIST[$i]}"
  START=$(echo "$seg" | cut -d'-' -f1 | tr -d ' ')
  END=$(echo "$seg" | cut -d'-' -f2 | tr -d ' ')
  DUR=$((END - START))
  echo "    $((i+1)). ${START}s → ${END}s (${DUR}s)"
done

# ================================================================
# SETUP
# ================================================================
mkdir -p "$TEMP_DIR"
mkdir -p "$OUTPUT_DIR"

# ================================================================
# STEP 1: Extract and normalize each segment
# ================================================================
info "Extracting ${#SEGMENT_LIST[@]} segments..."

SEGMENT_FILES=()
TOTAL_DURATION=0

for i in "${!SEGMENT_LIST[@]}"; do
  seg="${SEGMENT_LIST[$i]}"
  START=$(echo "$seg" | cut -d'-' -f1 | tr -d ' ')
  END=$(echo "$seg" | cut -d'-' -f2 | tr -d ' ')
  DUR=$((END - START))
  TOTAL_DURATION=$((TOTAL_DURATION + DUR))

  DST="$TEMP_DIR/seg_$(printf '%03d' "$i").mp4"

  echo "    Segment $((i+1)): ${START}s → ${END}s (${DUR}s)"

  ffmpeg -y -ss "$START" -i "$INPUT_FILE" -t "$DUR" \
    -vf "scale=${DESKTOP_WIDTH}:${DESKTOP_HEIGHT}:force_original_aspect_ratio=increase,crop=${DESKTOP_WIDTH}:${DESKTOP_HEIGHT},fps=${FPS},format=yuv420p" \
    -an \
    -c:v libx264 \
    -preset fast \
    -crf 18 \
    -movflags +faststart \
    "$DST" 2>/dev/null

  SEGMENT_FILES+=("$DST")
done

info "Total raw duration: ${TOTAL_DURATION}s from ${#SEGMENT_FILES[@]} segments"

# ================================================================
# STEP 2: Concatenate segments
# ================================================================
if [ ${#SEGMENT_FILES[@]} -eq 1 ]; then
  info "Single segment - no concatenation needed"
  cp "${SEGMENT_FILES[0]}" "$TEMP_DIR/combined.mp4"

elif [ ${#SEGMENT_FILES[@]} -eq 2 ]; then
  info "Applying crossfade between 2 segments..."

  DUR0=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "${SEGMENT_FILES[0]}" | awk '{printf "%.2f", $1}')
  OFFSET=$(echo "$DUR0" | awk -v cf=$CROSSFADE '{printf "%.2f", $1 - cf}')

  ffmpeg -y -i "${SEGMENT_FILES[0]}" -i "${SEGMENT_FILES[1]}" \
    -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE}:offset=${OFFSET},format=yuv420p[v]" \
    -map "[v]" \
    -c:v libx264 -preset fast -crf 18 \
    -movflags +faststart \
    "$TEMP_DIR/combined.mp4" 2>/dev/null

else
  info "Concatenating ${#SEGMENT_FILES[@]} segments with crossfades..."

  # Build progressive crossfade chain
  # For 3+ clips, chain xfade filters: [0][1]xfade -> [tmp][2]xfade -> ...
  CURRENT_INPUT="${SEGMENT_FILES[0]}"
  RESULT="$CURRENT_INPUT"

  for i in $(seq 1 $((${#SEGMENT_FILES[@]} - 1))); do
    NEXT="${SEGMENT_FILES[$i]}"
    OUTPUT="$TEMP_DIR/chain_$(printf '%03d' "$i").mp4"

    DUR_PREV=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$RESULT" | awk '{printf "%.2f", $1}')
    OFFSET=$(echo "$DUR_PREV" | awk -v cf=$CROSSFADE '{printf "%.2f", $1 - cf}')

    ffmpeg -y -i "$RESULT" -i "$NEXT" \
      -filter_complex "[0:v][1:v]xfade=transition=fade:duration=${CROSSFADE}:offset=${OFFSET},format=yuv420p[v]" \
      -map "[v]" \
      -c:v libx264 -preset fast -crf 18 \
      -movflags +faststart \
      "$OUTPUT" 2>/dev/null

    RESULT="$OUTPUT"
  done

  cp "$RESULT" "$TEMP_DIR/combined.mp4"
fi

# ================================================================
# STEP 3: Add slow fade-in at start and fade-out at end
# ================================================================
info "Adding fade in/out..."

COMBINED_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$TEMP_DIR/combined.mp4" | awk '{printf "%.2f", $1}')
FADE_OUT_START=$(echo "$COMBINED_DUR" | awk '{printf "%.2f", $1 - 1.5}')

ffmpeg -y -i "$TEMP_DIR/combined.mp4" \
  -vf "fade=t=in:st=0:d=1,fade=t=out:st=${FADE_OUT_START}:d=1.5" \
  -c:v libx264 -preset fast -crf 18 \
  -movflags +faststart \
  "$TEMP_DIR/faded.mp4" 2>/dev/null

mv "$TEMP_DIR/faded.mp4" "$TEMP_DIR/combined.mp4"

# ================================================================
# STEP 4: Export desktop (1080p)
# ================================================================
DESKTOP_OUT="$OUTPUT_DIR/${OUTPUT_NAME}-desktop.mp4"
info "Encoding desktop (${DESKTOP_WIDTH}x${DESKTOP_HEIGHT})..."

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
  "$DESKTOP_OUT" 2>/dev/null

DESKTOP_SIZE=$(ls -lh "$DESKTOP_OUT" | awk '{print $5}')

# ================================================================
# STEP 5: Export mobile (720p)
# ================================================================
MOBILE_OUT="$OUTPUT_DIR/${OUTPUT_NAME}-mobile.mp4"
info "Encoding mobile (${MOBILE_WIDTH}x${MOBILE_HEIGHT})..."

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
  "$MOBILE_OUT" 2>/dev/null

MOBILE_SIZE=$(ls -lh "$MOBILE_OUT" | awk '{print $5}')

# ================================================================
# STEP 6: Poster frame (from 1 second in)
# ================================================================
POSTER_OUT="$OUTPUT_DIR/${OUTPUT_NAME}-poster.jpg"
info "Extracting poster frame..."

ffmpeg -y -ss 1 -i "$DESKTOP_OUT" \
  -vframes 1 \
  -q:v 2 \
  "$POSTER_OUT" 2>/dev/null

# ================================================================
# DONE
# ================================================================
FINAL_DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$DESKTOP_OUT" | awk '{printf "%.1f", $1}')

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
echo "  Final duration: ${FINAL_DUR}s"
echo "  Segments used:  ${#SEGMENT_LIST[@]}"
echo ""
echo "  HTML snippet:"
echo ""
echo "    <video autoplay muted loop playsinline"
echo "           poster=\"video/${OUTPUT_NAME}-poster.jpg\">"
echo "      <source src=\"video/${OUTPUT_NAME}-desktop.mp4\""
echo "              media=\"(min-width: 768px)\" type=\"video/mp4\">"
echo "      <source src=\"video/${OUTPUT_NAME}-mobile.mp4\""
echo "              type=\"video/mp4\">"
echo "    </video>"
echo ""
