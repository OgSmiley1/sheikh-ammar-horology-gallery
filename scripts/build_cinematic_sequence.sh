#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/ubuntu/webdev-static-assets/cinematic-sheikh-frames"
OUT="/home/ubuntu/webdev-static-assets/royal-horology-cinematic-background.mp4"

ffmpeg -y \
  -i "$ROOT/frame-01-dawn.jpg" \
  -i "$ROOT/frame-02-study.jpg" \
  -i "$ROOT/frame-03-continuity.jpg" \
  -i "$ROOT/frame-04-ceremony.jpg" \
  -filter_complex "
    [0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(pzoom+0.00028,1.06)':d=210:s=1280x720:fps=30,eq=saturation=0.82:contrast=0.97,format=yuv420p[v0];
    [1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(pzoom+0.00024,1.05)':d=210:s=1280x720:fps=30,eq=saturation=0.76:contrast=0.95,format=yuv420p[v1];
    [2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(pzoom+0.00022,1.05)':d=210:s=1280x720:fps=30,eq=saturation=0.70:contrast=0.94,format=yuv420p[v2];
    [3:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(pzoom+0.00018,1.04)':d=210:s=1280x720:fps=30,eq=saturation=0.74:contrast=0.95,format=yuv420p[v3];
    [v0][v1]xfade=transition=fade:duration=1:offset=6[x1];
    [x1][v2]xfade=transition=fade:duration=1:offset=12[x2];
    [x2][v3]xfade=transition=fade:duration=1:offset=18[v]
  " \
  -map "[v]" -an -c:v libx264 -preset medium -crf 20 -pix_fmt yuv420p -movflags +faststart "$OUT"

ffprobe -v error -show_entries format=duration,size -show_entries stream=codec_name,width,height,r_frame_rate -of default=noprint_wrappers=1 "$OUT"
