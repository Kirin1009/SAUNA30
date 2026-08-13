#!/bin/sh
set -eu

output_dir=${1:-..}

magick -size 256x256 xc:gray50 -seed 17 -attenuate 0.2 +noise Gaussian \
  -colorspace gray -blur 0x0.7 -normalize \
  +level-colors '#F8F2E4','#FEFAF0' /tmp/totonoi-paper-page-quarter.png
magick /tmp/totonoi-paper-page-quarter.png \( +clone -flop \) +append \
  /tmp/totonoi-paper-page-top.png
magick /tmp/totonoi-paper-page-top.png \( +clone -flip \) -append \
  -define webp:lossless=true "${output_dir}/paper-page.webp"

magick -size 256x256 xc:gray50 -seed 29 -attenuate 0.23 +noise Gaussian \
  -colorspace gray -blur 0x0.65 -normalize \
  +level-colors '#ECE3CE','#F8F1DF' /tmp/totonoi-paper-divider-quarter.png
magick /tmp/totonoi-paper-divider-quarter.png \( +clone -flop \) +append \
  /tmp/totonoi-paper-divider-top.png
magick /tmp/totonoi-paper-divider-top.png \( +clone -flip \) -append \
  -define webp:lossless=true "${output_dir}/paper-divider.webp"
