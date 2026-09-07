#!/usr/bin/env bash
set -euo pipefail

ASSET_DIR="/home/ubuntu/webdev-static-assets"
OUTPUT="$ASSET_DIR/royal-horology-maison-film-arabic.mp4"

ffmpeg -y \
  -i "$ASSET_DIR/maison-film-opening.mp4" \
  -i "$ASSET_DIR/royal-horology-cinematic-background.mp4" \
  -i "$ASSET_DIR/maison-film-narration-arabic-a.wav" \
  -i "$ASSET_DIR/maison-film-narration-arabic-b.wav" \
  -filter_complex "\
    [0:v][1:v]concat=n=2:v=1:a=0,format=yuv420p[v]; \
    anullsrc=channel_layout=stereo:sample_rate=48000,atrim=duration=33.0[silence]; \
    [2:a]adelay=1000|1000,volume=1.0[a0]; \
    [3:a]adelay=16000|16000,volume=1.0[a1]; \
    [silence][a0][a1]amix=inputs=3:duration=first:normalize=0,alimiter=limit=0.92[a]" \
  -map "[v]" \
  -map "[a]" \
  -c:v libx264 -preset medium -crf 20 -movflags +faststart \
  -c:a aac -b:a 192k \
  -shortest \
  "$OUTPUT"

ffprobe -v error -show_entries format=duration:stream=codec_name,width,height -of default=noprint_wrappers=1 "$OUTPUT"
