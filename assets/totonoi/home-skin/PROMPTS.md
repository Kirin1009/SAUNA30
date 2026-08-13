# 生成記録

## アプリアイコン

- モード: built-in image generation
- 用途: `logo-brand`
- 参照画像: リポジトリ既存の `icon-512.png`（キャラクターと線の世界観のみ参照）

```text
Use case: logo-brand
Asset type: 1024 x 1024 mobile app icon for the Japanese sauna log app ととのい帳
Input image 1: style and character reference; preserve the same gentle hand-drawn brown linework, cream paper background, white sauna-hat character, simple closed-eye expression, and vermilion accent
Primary request: redraw the same character holding a small Japanese accordion goshuin book close to the chest; place exactly one bold vermilion circular seal mark on the book cover; the book and seal should read clearly at small icon size
Composition: centered bust portrait, strong simple silhouette, generous padding, square canvas, no outer rounded-square frame
Palette: warm cream #FBF6EA, dark brown #4A3B2E linework, vermilion #C8402F; no gold
Style: tactile hand-drawn ink and colored-pencil texture, quiet and friendly, consistent with the reference image
Constraints: no letters, no Japanese text, no numbers, no gradients, no photorealism, no extra objects, no watermark; exactly one vermilion seal; avoid tiny details
```

生成後、外周背景を `#FBF6EA` の単色に整え、1024x1024 PNGへ書き出した。人物・帳・朱印の描画は変更していない。

## その他の素材

和紙、綴じ、小口、栞、タブアイコンは画像生成を使わず、`source/` の原版から決定的に書き出した。和紙は `generate-paper.sh` で256px四方の紙目を左右・上下へ鏡像接続し、512pxタイルの境界画素を完全一致させている。
