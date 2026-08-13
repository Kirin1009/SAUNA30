#!/bin/sh
set -eu

output_dir=${1:-..}

# A mirrored 128px source guarantees exact left/right and top/bottom edges.
magick -size 128x128 xc:gray50 -seed 43 -attenuate 0.24 +noise Gaussian \
  -colorspace gray -blur 0x0.72 -normalize \
  +level-colors '#F4E8CF','#FFF7E7' /tmp/totonoi-map-paper-quarter.png

# Add restrained, broad age marks before mirroring. No grid is baked in.
magick /tmp/totonoi-map-paper-quarter.png \
  -fill '#B88B4A10' -draw 'ellipse 24,36 42,45 0,360' \
  -fill '#A86F3510' -draw 'ellipse 91,82 108,92 0,360' \
  -blur 0x5 /tmp/totonoi-map-paper-aged-quarter.png

magick /tmp/totonoi-map-paper-aged-quarter.png \( +clone -flop \) +append \
  /tmp/totonoi-map-paper-top.png
magick /tmp/totonoi-map-paper-top.png \( +clone -flip \) -append \
  -define webp:lossless=true "${output_dir}/map-paper.webp"
