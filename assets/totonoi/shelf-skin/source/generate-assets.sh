#!/bin/sh
set -eu

output_dir=${1:-..}
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

# Mirroring a 128px source along both axes makes opposite edge pixels identical.
magick -size 128x128 xc:gray50 -seed 61 -attenuate 0.20 +noise Gaussian \
  -colorspace gray -blur 0x1.1 -normalize -resize 128x48! -resize 128x128! \
  +level-colors '#E9DEC7','#F8F1E2' /tmp/totonoi-wood-back-quarter.png
magick /tmp/totonoi-wood-back-quarter.png \
  -stroke '#A98E6612' -strokewidth 1 -fill none \
  -draw 'path "M 5,24 C 33,19 70,31 123,22"' \
  -draw 'path "M 8,65 C 45,58 76,72 121,62"' \
  -draw 'path "M 3,101 C 42,95 84,109 125,98"' \
  /tmp/totonoi-wood-back-lined.png
magick /tmp/totonoi-wood-back-lined.png \( +clone -flop \) +append /tmp/totonoi-wood-back-top.png
magick /tmp/totonoi-wood-back-top.png \( +clone -flip \) -append \
  -define webp:lossless=true "${output_dir}/wood-back.webp"

magick -size 128x128 xc:gray50 -seed 83 -attenuate 0.30 +noise Gaussian \
  -colorspace gray -blur 0x1.5 -normalize -resize 128x30! -resize 128x128! \
  +level-colors '#B8824D','#D8AD73' /tmp/totonoi-wood-shelf-quarter.png
magick /tmp/totonoi-wood-shelf-quarter.png \
  -stroke '#6F47251E' -strokewidth 1 -fill none \
  -draw 'path "M 2,18 C 34,13 75,24 126,16"' \
  -draw 'path "M 4,49 C 40,43 88,56 124,47"' \
  -draw 'path "M 1,83 C 42,77 82,91 127,80"' \
  -draw 'path "M 6,114 C 38,108 91,120 124,111"' \
  /tmp/totonoi-wood-shelf-lined.png
magick /tmp/totonoi-wood-shelf-lined.png \( +clone -flop \) +append /tmp/totonoi-wood-shelf-top.png
magick /tmp/totonoi-wood-shelf-top.png \( +clone -flip \) -append \
  -define webp:lossless=true "${output_dir}/wood-shelf.webp"

for name in bonsai vase yunomi; do
  magick -background none -density 192 "${script_dir}/deco-${name}.svg" \
    -resize 256x256 -define webp:lossless=true "${output_dir}/deco-${name}.webp"
done
