#!/bin/bash
# ─── GSB Realtor — Image Optimization Script ──────────────────────────
# Converts all JPG/PNG images to optimized WebP + compressed JPG fallback
# Requires: sudo apt install imagemagick webp
# Or use: npx sharp-cli (Node-based)
#
# Run from project root: bash optimize-images.sh

set -e

INPUT_DIR="public/images"
BACKUP_DIR="public/images-original"
MAX_WIDTH=1920
QUALITY=80

echo "🔧 GSB Image Optimizer"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup originals
if [ ! -d "$BACKUP_DIR" ]; then
  echo "📦 Backing up originals to $BACKUP_DIR..."
  cp -r "$INPUT_DIR" "$BACKUP_DIR"
fi

# Process each image
for img in "$INPUT_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
  [ -f "$img" ] || continue

  filename=$(basename "$img")
  name="${filename%.*}"
  ext="${filename##*.}"
  size_before=$(du -h "$img" | cut -f1)

  echo ""
  echo "Processing: $filename ($size_before)"

  # Resize + compress JPG (fallback)
  convert "$img" \
    -resize "${MAX_WIDTH}x${MAX_WIDTH}>" \
    -quality "$QUALITY" \
    -strip \
    -interlace Plane \
    -sampling-factor 4:2:0 \
    "$INPUT_DIR/${name}.jpg"

  # Create WebP version
  if command -v cwebp &>/dev/null; then
    cwebp -q "$QUALITY" -resize "$MAX_WIDTH" 0 "$INPUT_DIR/${name}.jpg" \
      -o "$INPUT_DIR/${name}.webp" 2>/dev/null
  else
    convert "$INPUT_DIR/${name}.jpg" -resize "${MAX_WIDTH}x>" -quality "$QUALITY" "${INPUT_DIR}/${name}.webp"
  fi

  size_after=$(du -h "$INPUT_DIR/${name}.jpg" | cut -f1)
  echo "  ✅ JPG: $size_before → $size_after"

  if [ -f "$INPUT_DIR/${name}.webp" ]; then
    size_webp=$(du -h "$INPUT_DIR/${name}.webp" | cut -f1)
    echo "  ✅ WebP: $size_webp"
  fi
done

# Process team images
for img in "$INPUT_DIR"/team/*.{jpg,jpeg,png,JPG,JPEG,PNG} 2>/dev/null; do
  [ -f "$img" ] || continue

  filename=$(basename "$img")
  name="${filename%.*}"
  size_before=$(du -h "$img" | cut -f1)

  echo ""
  echo "Processing team: $filename ($size_before)"

  convert "$img" \
    -resize "800x800>" \
    -quality "$QUALITY" \
    -strip \
    "$INPUT_DIR/team/${name}.jpg"

  size_after=$(du -h "$INPUT_DIR/team/${name}.jpg" | cut -f1)
  echo "  ✅ $size_before → $size_after"
done

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ All images optimized!"
echo ""

# Summary
before_total=$(du -sh "$BACKUP_DIR" 2>/dev/null | cut -f1)
after_total=$(du -sh "$INPUT_DIR" | cut -f1)
echo "Total before: $before_total"
echo "Total after:  $after_total"
echo ""
echo "💡 Next steps:"
echo "   1. Verify images look correct"
echo "   2. Update next.config.js to use WebP format"
echo "   3. Deploy and re-run Lighthouse"
