'use strict';
const facilities = {
  g4: {name:'新岐阜サウナ', place:'岐阜市', file:'ref-shin-gifu-sauna.png', scene:'寝水風呂で休む姿'},
  a9: {name:'竜泉寺の湯', place:'名古屋守山本店', file:'a9-ryusenji-moriyama.png', scene:'熱風を受ける姿'},
  g6: {name:'湯どころ みのり', place:'岐南町', file:'g6-minori.png', scene:'足湯の椅子で休む姿'}
};
const concepts = {
  a: {title:'A / 紙のアルバム', shelf:'印帖', rank:'好み', description:'一印を大きく、二印をその下へ。紙の重なりと綴じ目で手元の一冊にする。順位は大きな一印から静かなリストへ。新名称「好み」は、世間の評価と区別しやすい。'},
  b: {title:'B / 木の飾り棚', shelf:'飾り棚', rank:'湯選', description:'三印を紙札として木の棚に立てる。光、棚板の厚み、落ちる影が主役。順位は一段高い一印と、続く二印を立体的に並べる。新名称「湯選」は選び抜いたコレクションの語感。'},
  c: {title:'C / 藍の展示室', shelf:'コレクション', rank:'マイベスト', description:'深い藍の空間に一印ずつ展示。小さなサムネイルで主役を替える。順位画面も絵を大きく見せ、数字は端へ退ける。新名称「マイベスト」は機能が最も伝わりやすい。'}
};
const params = new URLSearchParams(location.search);
const theme = Object.hasOwn(concepts,params.get('theme')) ? params.get('theme') : 'a';
const page = params.get('screen') === 'rank' ? 'rank' : 'shelf';
const ids = ['g4','a9','g6'];
const img = id => `<img src="images/${facilities[id].file}" width="1254" height="1254" alt="${facilities[id].name}：${facilities[id].scene}" decoding="sync">`;
const label = id => `<span class="label">${facilities[id].name}<span class="location">${facilities[id].place}</span></span>`;
const seal = (id, labelled=false) => `<button class="seal-button" type="button" data-facility="${id}" aria-label="${facilities[id].name}の印を拡大">${img(id)}${labelled?label(id):''}</button>`;
const url = (t,p) => `?theme=${t}&screen=${p}`;
function shelf(t) {
  if(t==='a') return `<div class="album"><div class="album-feature">${seal('g4',true)}</div><div class="album-grid">${seal('a9',true)}${seal('g6',true)}</div></div>`;
  if(t==='b') return `<div class="cabinet"><div class="cabinet-row">${seal('g4',true)}${seal('a9',true)}</div><div class="cabinet-row cabinet-lower"><p class="cabinet-note">東海<span>岐阜・愛知</span></p>${seal('g6',true)}</div></div><p class="wood-label">ととのい帳</p>`;
  return `<div class="gallery"><div class="gallery-art" data-gallery-art>${seal('g4')}</div><div class="gallery-caption"><div><h2 data-gallery-title>新岐阜サウナ</h2><span class="location" data-gallery-place>岐阜市</span></div><span class="fraction" data-gallery-index>01 / 03</span></div><div class="thumbnails" aria-label="展示する印">${ids.map((id,i)=>`<button type="button" data-gallery="${id}" aria-label="${facilities[id].name}を展示" aria-pressed="${i===0}">${img(id)}</button>`).join('')}</div><p class="gallery-hint">印をタップして拡大</p></div>`;
}
// Layout fixtures only: no personal scores, visits or ranking are loaded or saved.
const orders = {total:ids,sauna:['a9','g4','g6'],water:['g4','a9','g6'],rest:['g6','g4','a9'],clean:['g6','a9','g4'],route:['a9','g6','g4']};
function rows(axis='total') { return orders[axis].map((id,i)=>`<li class="rank-row" data-id="${id}"><span class="rank-no" aria-label="${i+1}位">${String(i+1).padStart(2,'0')}</span>${seal(id)}<div class="rank-copy"><h2>${facilities[id].name}</h2><p class="place">${facilities[id].place}</p></div></li>`).join(''); }
function ranking(t) { return `<div class="rank-tools"><label for="axis-${t}">採点で比較</label><select id="axis-${t}" data-axis><option value="total">総合</option><option value="sauna">サウナ</option><option value="water">水風呂</option><option value="rest">休憩</option><option value="clean">清潔</option><option value="route">導線</option></select></div><div class="${t==='b'?'podium':t==='c'?'spotlight':'paper-rank'}"><ol class="rank-list">${rows()}</ol></div><p class="rank-note">順位は配置見本 / 整い★は採点外</p><details class="legacy"><summary>470sの旧採点</summary><p>旧採点はここで別に表示します。このモックに取り込みデータはありません。現在の順位には混ぜません。</p></details>`; }
function screen(t,p) {
  const c=concepts[t];
  return `<section class="screen" data-theme="${t}" aria-label="${c.title} ${p==='shelf'?c.shelf:c.rank}"><header class="mast"><span class="brand">ととのい帳</span><span class="fixture">表示見本</span></header><div class="page-head"><h1>${p==='shelf'?c.shelf:c.rank}</h1><span class="head-note">${p==='shelf'?'三つの印':'採点から'}</span></div><div class="content">${p==='shelf'?shelf(t):ranking(t)}</div>${p==='shelf'?'<div class="shelf-foot"><span>訪問数・日付は省略した見本</span><button data-about type="button">この見本について</button></div>':''}<nav class="nav" aria-label="比較対象の画面"><a href="${url(t,'shelf')}" ${p==='shelf'?'aria-current="page"':''}>${c.shelf}</a><a href="${url(t,'rank')}" ${p==='rank'?'aria-current="page"':''}>${c.rank}</a><a class="back" href="index.html" aria-label="三案の比較へ">A–C</a></nav></section>`;
}
const app=document.getElementById('app');
if(params.has('theme')) {
  document.body.dataset.theme=theme;
  document.title=`${concepts[theme].title} / ${page==='shelf'?'棚':concepts[theme].rank}`;
  app.innerHTML=screen(theme,page);
} else if(params.has('board')) {
  const p=params.get('board')==='rank'?'rank':'shelf';
  app.innerHTML=`<div class="comparison"><h1>${p==='shelf'?'棚':'採点から見返す'} / 三案比較</h1><div class="comparison-grid">${Object.entries(concepts).map(([t,c])=>`<figure><figcaption>${c.title}</figcaption>${screen(t,p)}</figure>`).join('')}</div></div>`;
} else {
  app.innerHTML=`<div class="review"><header><h1>棚と、採点から見返す画面</h1><p>絵の印が主役になる三つの方向。句点付きの標語と「私の番付」をやめ、文字量より素材・構図・光で違いを作りました。施設印はPR #69の採用済み三印。順位と並びは表示見本です。</p><div class="review-links"><a href="?board=shelf">棚を横並び</a><a href="?board=rank">順位を横並び</a></div></header>${Object.entries(concepts).map(([t,c])=>`<section class="direction"><header><h2>${c.title}</h2><span>棚「${c.shelf}」 / 順位「${c.rank}」</span></header><p class="description">${c.description}</p><div class="pair">${['shelf','rank'].map(p=>`<figure><iframe src="${url(t,p)}" title="${c.title} ${p==='shelf'?'棚':'順位'}" loading="lazy"></iframe><figcaption><a href="${url(t,p)}">${p==='shelf'?'棚':c.rank}を単独で開く</a></figcaption></figure>`).join('')}</div></section>`).join('')}<p>提案はB。絵が集まる楽しさを、三印だけでも表現できます。日々の操作を軽くするならA、絵を一枚ずつ鑑賞するならC。選定後に5画面へ展開します。未選定・未実装です。</p></div>`;
}
const dialog=document.createElement('dialog');
dialog.setAttribute('aria-label','印の拡大とモックの説明');
document.body.append(dialog);
function show(content,t) { dialog.dataset.theme=t; dialog.innerHTML=content+'<button type="button" data-close>閉じる</button>'; dialog.showModal(); }
document.addEventListener('click',e=>{
  const b=e.target.closest('button'); if(!b)return;
  const s=b.closest('.screen');
  if(b.dataset.facility) { const id=b.dataset.facility; show(`${img(id)}<h2>${facilities[id].name}</h2><p>${facilities[id].place}</p><p>採用済みの施設印。ここは鑑賞用モックで、訪問記録や設備情報は編集しません。</p>`,s.dataset.theme); }
  if(b.hasAttribute('data-about'))show('<h2>三印の配置見本</h2><p>実際の訪問数・日付・採点は読み込んでいません。未制作施設の印はこの見本に追加していません。本体未変更、保存・外部通信なし。</p>',s.dataset.theme);
  if(b.hasAttribute('data-close'))dialog.close();
  if(b.dataset.gallery) {
    const id=b.dataset.gallery;
    s.querySelector('[data-gallery-art]').innerHTML=seal(id);
    s.querySelector('[data-gallery-title]').textContent=facilities[id].name;
    s.querySelector('[data-gallery-place]').textContent=facilities[id].place;
    s.querySelector('[data-gallery-index]').textContent=`0${ids.indexOf(id)+1} / 03`;
    s.querySelectorAll('[data-gallery]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
  }
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
document.addEventListener('change',e=>{if(e.target.matches('[data-axis]'))e.target.closest('.screen').querySelector('.rank-list').innerHTML=rows(e.target.value);});
