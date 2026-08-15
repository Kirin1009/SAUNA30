# ととのい帳 帳の造作素材 第4弾

Issue #24 の量産依頼に基づく、帳ホームの紙造作5点です。`index.html`への組み込みは含みません。

## 納品物

| ファイル | サイズ | 用途 |
| --- | ---: | --- |
| `page-edge-top.webp` | 768x64 | ページ上辺の薄い紙層。横方向への引き伸ばし用。 |
| `page-stack-bottom.webp` | 768x112 | 下辺から覗く2〜3枚の紙層。現行の疑似要素を置き換える。 |
| `page-fore-edge.webp` | 96x512 | 右小口と控えめな影。上下端一致の縦タイル。 |
| `page-curl-latest.webp` | 192x192 | 最新ページ右下のめくれ。透過オーバーレイ。 |
| `visit-slip.webp` | 512x144 | 再訪表示の無地短冊。文字は実装側で重ねる。 |

## レイヤー順

下から順に重ねる想定です。

1. `paper-page.webp`を帳面全体の下地に敷く。
2. `page-edge-top.webp`、`page-stack-bottom.webp`、`page-fore-edge.webp`を帳面の外周へ置く。
3. 訪問内容と御朱印を置き、再訪時は文字の背面に`visit-slip.webp`を敷く。
4. 最新ページだけ`page-curl-latest.webp`を右下へ重ねる。
5. `binding-left.webp`を左端の最前面に置く。

## 組み込みメモ

- `page-edge-top.webp`と`page-stack-bottom.webp`は`background-size: 100% 100%`で横方向へ伸縮する。
- `page-fore-edge.webp`は`background-repeat: repeat-y`で使用する。上下端は同一画素なので継ぎ目が出ない。
- `page-curl-latest.webp`は右下基準で配置し、判子や操作対象を隠さない範囲で使う。
- `visit-slip.webp`は無地の背景素材。日付、回数、施設名などの文字は画像へ焼き込まない。
- 紙色は既存の`paper-page.webp`と同じ`#FBF6EA`を基準にした。金色、グラデーション、文字は使用していない。
- `source/`にSVG原版と再生成スクリプトを収録した。`source/generate-assets.sh`を`source/`内で実行すると親ディレクトリへWebPを書き出す。
