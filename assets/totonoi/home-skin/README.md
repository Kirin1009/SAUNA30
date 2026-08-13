# ととのい帳 帳ホーム・スキン素材 第1弾

Issue #24 の量産依頼に基づく、390px基準の差し替え用素材です。`index.html` への組み込みは含みません。

## 納品物

| ファイル | サイズ | 用途 |
| --- | ---: | --- |
| `paper-page.webp` | 512x512 | 帳ページ下地。シームレス。 |
| `paper-divider.webp` | 512x512 | ページ区切り側の暗い紙。シームレス。 |
| `binding-left.webp` | 64x512 | 左端の和綴じ。縦タイル。透過。 |
| `page-peek.webp` | 390x48 | 下端から覗く前ページ。透過。 |
| `ribbon-gold.webp` | 200x600 | 達成栞。透過。1画面につき1本まで。 |
| `tab-book.webp` | 256x256 | 帳タブ。黒1色・透過。 |
| `tab-search.webp` | 256x256 | 探すタブ。黒1色・透過。 |
| `tab-shelf.webp` | 256x256 | 棚タブ。黒1色・透過。 |
| `tab-log.webp` | 256x256 | 記録タブ。黒1色・透過。 |
| `app-icon-1024.png` | 1024x1024 | アプリアイコン原寸。文字なし。 |

## 組み込みメモ

- 和紙は `background-color: #FBF6EA` と併用し、`background-repeat: repeat` で使用する。
- 綴じ帯は帳の左端へ固定し、`background-repeat: repeat-y` とする。
- ページ覗きはコンテンツ末尾の装飾レイヤーとして横幅100%で使う。
- タブアイコンは `mask-image` / `-webkit-mask-image` と `background: currentColor` で着色する。
- 栞は右上から垂らし、同一画面で複数表示しない。
- `source/` は再書き出し用原版。和紙は `generate-paper.sh`、その他はSVG。アプリアイコンは画像生成した既存キャラクター派生案。

## 色

- 紙 `#FBF6EA`
- 区切り紙 `#F3ECDA`
- こげ茶 `#4A3B2E`
- 判子朱 `#C8402F`
- 金 `#C7973F`
