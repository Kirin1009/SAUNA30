#!/bin/sh
set -eu

output_dir=${1:-..}
script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)

render() {
  name=$1
  size=$2
  magick -background none -density 96 "${script_dir}/${name}.svg" \
    -resize "${size}!" -define webp:lossless=true "${output_dir}/${name}.webp"
}

render page-edge-top 768x64
render page-stack-bottom 768x112
render page-fore-edge 96x512
render page-curl-latest 192x192
render visit-slip 512x144
