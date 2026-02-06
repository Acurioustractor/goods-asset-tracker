#!/bin/bash
#
# analyze-video.sh
# Analyzes a long video and generates a scene-by-scene report with
# thumbnails so you can pick the best b-roll segments.
#
# Usage:
#   ./tools/analyze-video.sh <video-file> [interval-seconds]
#
# Examples:
#   ./tools/analyze-video.sh media/raw/snow-pitch.mp4
#   ./tools/analyze-video.sh media/raw/factory-tour.mp4 5
#
# What it does:
#   1. Detects scene changes in the video
#   2. Extracts a thumbnail every N seconds (default: 3)
#   3. Generates a report with timestamps and frame previews
#   4. Reports video metadata (duration, resolution, etc.)
#   5. Creates an HTML preview page you can open in browser
#
# You then tell Claude which timestamps to use and it will extract them.
#
# Requirements: ffmpeg (brew install ffmpeg)

set -e

# ================================================================
# CONFIG
# ================================================================
INPUT_FILE="${1:?Usage: $0 <video-file> [interval-seconds]}"
INTERVAL="${2:-3}"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
TEMP_DIR="/tmp/goods-video-analyze-$$"
THUMBS_DIR="$TEMP_DIR/thumbs"

# ================================================================
# HELPERS
# ================================================================
cleanup() {
  # Keep output, clean temp
  true
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
[ -f "$INPUT_FILE" ] || error "Video file not found: $INPUT_FILE"

# ================================================================
# GET VIDEO INFO
# ================================================================
BASENAME=$(basename "$INPUT_FILE" | sed 's/\.[^.]*$//')
DURATION=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$INPUT_FILE" | awk '{printf "%.1f", $1}')
DURATION_INT=$(echo "$DURATION" | awk '{printf "%d", $1}')
RESOLUTION=$(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$INPUT_FILE")
FRAMERATE=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$INPUT_FILE" | awk -F/ '{printf "%.1f", $1/$2}')
FILESIZE=$(ls -lh "$INPUT_FILE" | awk '{print $5}')

echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  Goods on Country - Video Analyzer       ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  File:       $(basename "$INPUT_FILE")"
echo "  Duration:   ${DURATION}s"
echo "  Resolution: $RESOLUTION"
echo "  Framerate:  ${FRAMERATE}fps"
echo "  File size:  $FILESIZE"
echo "  Interval:   ${INTERVAL}s between thumbnails"

# ================================================================
# SETUP
# ================================================================
mkdir -p "$THUMBS_DIR"

# Output location
OUTPUT_DIR="$PROJECT_DIR/media/analysis-${BASENAME}"
mkdir -p "$OUTPUT_DIR"

# ================================================================
# STEP 1: Extract thumbnails at intervals
# ================================================================
NUM_THUMBS=$((DURATION_INT / INTERVAL))
info "Extracting ~${NUM_THUMBS} thumbnails (every ${INTERVAL}s)..."

ffmpeg -y -i "$INPUT_FILE" \
  -vf "fps=1/${INTERVAL},scale=640:-1" \
  -q:v 3 \
  "$THUMBS_DIR/thumb_%04d.jpg" 2>/dev/null

THUMB_COUNT=$(ls "$THUMBS_DIR"/thumb_*.jpg 2>/dev/null | wc -l | tr -d ' ')
info "Extracted ${THUMB_COUNT} thumbnails"

# Copy thumbs to output
cp "$THUMBS_DIR"/thumb_*.jpg "$OUTPUT_DIR/"

# ================================================================
# STEP 2: Detect scene changes
# ================================================================
info "Detecting scene changes..."

SCENE_FILE="$TEMP_DIR/scenes.txt"
ffprobe -v quiet \
  -show_frames \
  -select_streams v \
  -show_entries frame=pts_time,pict_type \
  -of csv=p=0 \
  "$INPUT_FILE" 2>/dev/null | \
  awk -F',' '$2=="I" {print $1}' | \
  head -100 > "$SCENE_FILE"

SCENE_COUNT=$(wc -l < "$SCENE_FILE" | tr -d ' ')
info "Found ${SCENE_COUNT} keyframes (potential scene boundaries)"

# ================================================================
# STEP 3: Generate HTML preview
# ================================================================
info "Generating preview page..."

HTML_FILE="$OUTPUT_DIR/preview.html"

cat > "$HTML_FILE" << 'HTMLHEAD'
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Video Analysis</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, 'Inter', sans-serif; background: #0a0a0a; color: #fff; padding: 32px; }
  h1 { font-size: 24px; font-weight: 800; margin-bottom: 8px; }
  .meta { color: #a8a29e; font-size: 14px; margin-bottom: 32px; }
  .meta span { margin-right: 20px; }
  .instructions { background: #1c1917; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 20px; margin-bottom: 32px; font-size: 14px; color: #a8a29e; line-height: 1.7; }
  .instructions strong { color: #fbbf24; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 12px; }
  .frame { position: relative; border-radius: 4px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: all 0.2s; }
  .frame:hover { border-color: #d97706; }
  .frame.selected { border-color: #10b981; }
  .frame img { width: 100%; display: block; }
  .frame-info { position: absolute; bottom: 0; left: 0; right: 0; padding: 8px 12px; background: linear-gradient(transparent, rgba(0,0,0,0.8)); display: flex; justify-content: space-between; align-items: center; }
  .frame-time { font-size: 13px; font-weight: 700; font-variant-numeric: tabular-nums; }
  .frame-idx { font-size: 11px; color: #57534e; }
  .selected-list { position: fixed; bottom: 0; left: 0; right: 0; background: #1c1917; border-top: 1px solid rgba(255,255,255,0.1); padding: 16px 32px; display: none; z-index: 10; }
  .selected-list.show { display: block; }
  .selected-list h3 { font-size: 13px; font-weight: 600; color: #d97706; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
  .selected-list code { font-size: 13px; color: #fbbf24; background: rgba(217,119,6,0.1); padding: 4px 8px; border-radius: 4px; display: inline-block; margin-right: 8px; margin-bottom: 4px; }
  .copy-btn { background: #d97706; color: #000; border: none; padding: 8px 16px; border-radius: 4px; font-size: 13px; font-weight: 600; cursor: pointer; margin-top: 8px; }
</style>
</head>
<body>
HTMLHEAD

# Write video info
cat >> "$HTML_FILE" << EOF
<h1>Video Analysis: ${BASENAME}</h1>
<div class="meta">
  <span>Duration: ${DURATION}s</span>
  <span>Resolution: ${RESOLUTION}</span>
  <span>Framerate: ${FRAMERATE}fps</span>
  <span>Size: ${FILESIZE}</span>
</div>
<div class="instructions">
  <strong>How to use:</strong> Click frames to select the best b-roll moments.
  Selected timestamps appear at the bottom. Copy them and tell Claude:
  "Extract these segments: [timestamps]" and it will create the background video.
</div>
<div class="grid">
EOF

# Write thumbnails
IDX=0
for thumb in "$OUTPUT_DIR"/thumb_*.jpg; do
  FILENAME=$(basename "$thumb")
  TIMESTAMP=$((IDX * INTERVAL))
  MINS=$((TIMESTAMP / 60))
  SECS=$((TIMESTAMP % 60))
  TIMECODE=$(printf "%d:%02d" "$MINS" "$SECS")

  cat >> "$HTML_FILE" << EOF
  <div class="frame" onclick="toggleFrame(this, '$TIMECODE', $TIMESTAMP)" data-time="$TIMESTAMP">
    <img src="$FILENAME" alt="Frame at $TIMECODE" loading="lazy">
    <div class="frame-info">
      <span class="frame-time">$TIMECODE</span>
      <span class="frame-idx">#$((IDX + 1))</span>
    </div>
  </div>
EOF
  IDX=$((IDX + 1))
done

# Close grid and add script
cat >> "$HTML_FILE" << 'HTMLFOOT'
</div>

<div class="selected-list" id="selectedList">
  <h3>Selected Segments</h3>
  <div id="selectedTimes"></div>
  <button class="copy-btn" onclick="copySelected()">Copy Timestamps</button>
</div>

<script>
  const selected = new Map();

  function toggleFrame(el, timecode, seconds) {
    if (selected.has(seconds)) {
      selected.delete(seconds);
      el.classList.remove('selected');
    } else {
      selected.set(seconds, timecode);
      el.classList.add('selected');
    }
    updateList();
  }

  function updateList() {
    const list = document.getElementById('selectedList');
    const times = document.getElementById('selectedTimes');
    if (selected.size === 0) {
      list.classList.remove('show');
      return;
    }
    list.classList.add('show');
    const sorted = [...selected.entries()].sort((a, b) => a[0] - b[0]);
    times.innerHTML = sorted.map(([s, t]) => `<code>${t} (${s}s)</code>`).join('');
  }

  function copySelected() {
    const sorted = [...selected.entries()].sort((a, b) => a[0] - b[0]);
    const text = sorted.map(([s, t]) => `${t} (${s}s)`).join(', ');
    navigator.clipboard.writeText(text);
    const btn = document.querySelector('.copy-btn');
    btn.textContent = 'Copied!';
    setTimeout(() => btn.textContent = 'Copy Timestamps', 1500);
  }
</script>
</body>
</html>
HTMLFOOT

# ================================================================
# STEP 4: Generate text report
# ================================================================
REPORT_FILE="$OUTPUT_DIR/report.txt"

cat > "$REPORT_FILE" << EOF
VIDEO ANALYSIS REPORT
=====================
File:       $(basename "$INPUT_FILE")
Duration:   ${DURATION}s
Resolution: ${RESOLUTION}
Framerate:  ${FRAMERATE}fps
File size:  ${FILESIZE}
Thumbnails: ${THUMB_COUNT} (every ${INTERVAL}s)
Keyframes:  ${SCENE_COUNT}

THUMBNAILS
----------
EOF

IDX=0
for thumb in "$OUTPUT_DIR"/thumb_*.jpg; do
  TIMESTAMP=$((IDX * INTERVAL))
  MINS=$((TIMESTAMP / 60))
  SECS=$((TIMESTAMP % 60))
  printf "  %d:%02d  (%3ds)  thumb_%04d.jpg\n" "$MINS" "$SECS" "$TIMESTAMP" "$((IDX + 1))" >> "$REPORT_FILE"
  IDX=$((IDX + 1))
done

cat >> "$REPORT_FILE" << EOF

SCENE BOUNDARIES (keyframes)
----------------------------
EOF

while IFS= read -r timestamp; do
  SECS=$(echo "$timestamp" | awk '{printf "%d", $1}')
  MINS=$((SECS / 60))
  RSECS=$((SECS % 60))
  printf "  %d:%02d  (%s)\n" "$MINS" "$RSECS" "$timestamp" >> "$REPORT_FILE"
done < "$SCENE_FILE"

# ================================================================
# CLEANUP
# ================================================================
rm -rf "$TEMP_DIR"

# ================================================================
# DONE
# ================================================================
echo ""
echo "  ╔══════════════════════════════════════════╗"
echo "  ║  Analysis Complete                       ║"
echo "  ╚══════════════════════════════════════════╝"
echo ""
echo "  Output folder: $OUTPUT_DIR"
echo "  Thumbnails:    ${THUMB_COUNT} frames"
echo "  Preview:       $HTML_FILE"
echo "  Report:        $REPORT_FILE"
echo ""
echo "  Next steps:"
echo "    1. Open preview.html in your browser"
echo "    2. Click the best b-roll frames"
echo "    3. Copy the timestamps"
echo "    4. Tell Claude: \"Extract these segments from [video]: [timestamps]\""
echo ""
