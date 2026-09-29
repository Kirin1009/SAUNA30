'use strict';
const art = '../../../totonoi/art/';
const starsMarkup = n => Array.from({length:5},(_,i)=>`<span class="star${n>i&&n<i+1?' half':''}">${n>=i+1?'★':'☆'}</span>`).join('');
const facility = id => FACS.find(f => f.id === id);
const seal = (id, cls = '') => `<div class="seal ${cls}" aria-label="${esc(facility(id).name)}の既存生成判子">${facSeal(facility(id))}</div>`;
const nav = active => `<nav class="nav" aria-label="主要画面">${[['book','帳'],['search','探す'],['shelf','棚'],['log','記録']].map(([id,label])=>`<button type="button" data-nav="${id}" ${id===active?'aria-current="page"':''}><img src="${art}tab-${id}.webp" alt="">${label}</button>`).join('')}</nav>`;
const mast = section => `<header class="mast"><span class="brand">ととのい帳</span><p class="caption">${section}<br><span class="mono">2026 / 秋</span></p></header>`;
const heading = (kicker, title) => `<div class="page-heading"><p class="kicker">${kicker}</p><h2>${title}</h2></div>`;
const jobs = [
  {id:'01-stamp', title:'01 / 押す', active:'book', label:'押したら、ひと息。',
    tokens:'明朝22＝完了の主文、朱＝記録印、等幅＝日付・整い値、墨＝終了操作。',
    change:'完了を主役に維持。採点とは独立した任意の整い★を、その下に追加。',
    body:`<section class="receipt"><p class="kicker">今日の訪問を、帳に。</p><h2>一印、記しました</h2>${seal('g4')}<h3>新岐阜サウナ</h3><time class="caption">2026.09.21</time><p class="record">この湯に戻ってきました · <span class="mono">3</span> 回目</p><button class="primary" data-finish>帳面で眺める</button></section>
      <section class="next"><div class="next-title"><h3>余韻も、残しておく？</h3><span class="optional">任意</span></div><div class="rating-block"><div class="row"><label for="wellness">今日の整い</label><output id="wellness-value" for="wellness">4.5</output></div><div class="row"><span class="stars" aria-hidden="true">${starsMarkup(4.5)}</span><span class="caption">採点には含めません</span></div><input id="wellness" type="range" min="0" max="5" step="0.5" value="4.5" aria-describedby="wellness-help"><div class="row caption" id="wellness-help"><span>0〜5 / 0.5刻み</span><button class="text-link" data-clear-rating>未記録にする</button></div><div class="score-preview row"><div><b>施設の採点は、別に。</b><p class="caption">サウナ・水風呂・休憩・清潔・導線</p></div><button class="text-link" data-demo-action="採点シートへ進む導線の見本です。">採点へ →</button></div></div><div class="row"><button class="text-link" data-demo-action="写真を添える導線の見本です。">写真を添える</button><small>あとからでも、書かなくても。</small></div></section>`},
  {id:'02-shelf', title:'02 / どれだけ行ったか', active:'shelf', label:'持ち帰った、一印ずつ。',
    tokens:'明朝32＝棚の主見出し、等幅＝訪問数・日付、朱＝生成判子。棚板は既存素材。',
    change:'4列を2列へ。専用絵の枠と生成判子の混在を比較。獲得印章は施設の下へ移動。',
    body:`${heading('私のコレクション','集まった湯。')}<div class="summary"><div><strong>5</strong> <span>湯に出会い</span></div><div><strong>8</strong> <span>回、通った</span></div></div><div class="row shelf-heading"><h3>東海 / 岐阜</h3><span class="caption">訪問済み <span class="mono">4</span> 湯</span></div><div class="collection"><div class="shelf-grid">${['g4','g1','g2','g5'].map((id,i)=>`<article class="shelf-cell"><div class="stamp-space">${i===0?'<div class="art-placeholder"><span>新岐阜サウナ</span><b>専用絵が入る場所</b><small>未制作・配置比較用</small></div>':seal(id)}</div><h3>${id==='g2'?'恵みの湯':esc(facility(id).name)}</h3><time>2026.09.${[21,14,7,1][i].toString().padStart(2,'0')} · ${[3,2,1,1][i]}回</time></article>`).join('')}</div></div><div class="shelf-links"><button class="text-link" data-demo-action="未訪問の見本は、本人がこの入口を開いた後だけ表示します。">まだの湯をひらく</button><button class="text-link" data-demo-action="めぐり帳は県単位のopt-in。帳には進捗を持ち込みません。">県のめぐり帳 →</button></div><section class="earned"><div class="row"><h3>あなたの印章</h3><small>行った湯の性格から</small></div><div class="earned-row">${[['shaku','灼熱'],['single','シングル'],['night','深夜'],['yoyaku','予約']].map(([id,name])=>`<div class="crest"><i class="crest-icon" style="--crest:url(\'${art}km-${id}.webp\')" aria-hidden="true"></i>${name}</div>`).join('')}</div></section>`},
  {id:'03-ranking', title:'03 / 見返す', active:'log', label:'自分だけの、番付。',
    tokens:'明朝32＝番付の表題、明朝22＝第一位、等幅＝点数。二重罫で帳票の格を出す。',
    change:'記録タブへ横断ベスト5を追加。旧採点は別冊へ分け、上限90点を明示。',
    body:`${heading('記録 / 採点から振り返る','私の番付')}<p class="caption">世間の順位ではなく、私がつけた点。</p><div class="segment" aria-label="採点の出典"><button aria-pressed="true" data-rank-source="current">ととのい帳</button><button aria-pressed="false" data-rank-source="old">470s（旧）</button></div><div class="select-row"><label for="axis">比べる軸</label><select id="axis"><option value="total">総合点</option><option value="water">水風呂</option><option value="sauna">サウナ</option><option value="rest">休憩</option><option value="clean">清潔</option><option value="route">導線</option></select></div><div class="ranking" id="ranking"></div><p class="ranking-note" id="ranking-note">施設ごとの最新の採点付き訪問で比較。<br>470sの旧採点は混ぜず、別冊で見返せます。<br>旧採点は上限90点（導線2.5固定）の仕様。</p><div class="proof-notices"><p class="caption">検討注記 / 保存直後の通知例（いずれか一行）</p><div class="notice-spec"><b>私の番付、水風呂で新しい一位。</b></div><div class="notice-spec"><b>私の番付、総合のベスト5入り。</b></div></div>`},
  {id:'04-find', title:'04 / 探す', active:'search', label:'次の湯への、入口。',
    tokens:'明朝32＝画面見出し、22＝主役の施設名、等幅＝温度。入力は紙2、チップは墨。',
    change:'名称検索を最上段へ追加。条件は検索と併用。リストの一件目に余白と大きさを与える。',
    body:`${heading('湯を見つける','次は、どの湯へ。')}<div class="search"><label for="query">施設名で探す</label><input id="query" type="search" placeholder="施設名・市区町村" autocomplete="off"></div><div class="chips"><button data-filter="all" aria-pressed="true">東海</button><button data-filter="outdoor" aria-pressed="false">外気浴あり</button><button data-filter="cold" aria-pressed="false">水風呂10℃未満</button></div><div class="row"><p class="caption" id="result-count">表示見本 <span class="mono">5</span> 件</p><button class="text-link" data-demo-action="既存の地図へ切り替える入口です。このモックは位置情報を使いません。">地図で見る →</button></div><div id="results"></div><p class="caption">施設情報は収録値（2026.08.06版）。<br>最新の営業状況は施設の公式案内で確認。</p>`},
  {id:'05-facility', title:'05 / 施設ページ', active:'search', label:'施設を知り、自分の観測を重ねる。',
    tokens:'明朝22＝施設名、等幅32＝部屋温度。緋・藍は部屋の分類、朱は自分の観測値。',
    change:'部屋別の収録値と自分の観測を分離。熱源・型式・水深・ロウリュ種別の記入欄を提案。',
    body:`<button class="text-link" data-nav="search">← 探すへ</button><header class="facility-heading"><p class="kicker">岐阜県 / 岐阜市</p><h2>新岐阜サウナ</h2><p class="caption">男性専用 · 収録情報</p>${seal('g4')}</header><div class="facility-facts"><span>私の訪問 <b class="mono">3</b> 回</span><span>最新 <time>09.21</time></span><span>整い <b class="mono">4.5</b></span></div><div class="row"><h3>部屋を知る</h3><span class="caption">男性浴室</span></div><p class="caption">収録値と、自分の実測を並べて。</p><article class="room"><div class="row"><div><p class="room-type">サウナ / <span class="mono">s1</span></p><h3>サウナ室</h3></div><div class="temp">100<small>℃</small></div></div><p class="caption">カタログ収録値 · 2026.08.06版</p><div class="obs row"><span>私の実測 <b class="mono">102℃</b></span><time class="caption">09.21 17:00</time></div><div class="fields"><span>熱源　未記録</span><span>型式　未記録</span><span>ロウリュ種別　未記録</span><span>収録：ロウリュあり</span></div></article><article class="room water"><div class="row"><div><p class="room-type">水風呂 / <span class="mono">w1</span></p><h3>水風呂</h3></div><div class="temp">7<small>℃</small></div></div><p class="caption">カタログ収録値 · 2026.08.06版</p><div class="obs row"><span>私の実測 <b class="mono">8℃</b></span><time class="caption">09.21 17:00</time></div><div class="fields"><span>水深　未記録</span><span>観測日　未記録</span></div></article><div class="facility-actions"><button class="primary" data-demo-action="観測入力の導線見本。温度・熱源・型式・水深・ロウリュ種別を、部屋と日付に紐づけます。">部屋を選んで観測する</button><p class="caption">追加項目は候補。未確認の設備は埋めません。</p><div class="row"><button class="text-link" data-demo-action="3件の訪問史を開く導線の見本です。">私の訪問史 →</button><button class="text-link" data-demo-action="公式サイトへ進む導線の見本です。">公式案内 →</button></div></div>`}
];
const selected = new URLSearchParams(location.search).get('cut');
if(selected) document.body.classList.add('single');
document.getElementById('board').innerHTML = `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs>${SEAL_FILTER}</defs></svg>` + jobs.filter(j=>!selected||j.id===selected).map(j=>`<figure class="study"><h2>${j.title}</h2><section class="screen" id="${j.id}" aria-label="${j.title}"><div class="proof-banner">検討モック / 訪問・採点・観測は表示見本</div>${mast(j.label)}<div class="content">${j.body}</div>${nav(j.active)}</section><figcaption><b>トークン</b>${j.tokens}<b>現行からの変更</b>${j.change}<p>この説明・上部帯・通知例の注記は検品用。製品UIへ移植しない。</p></figcaption></figure>`).join('');

// All personal-looking values below are explicit, in-memory layout fixtures.
const rankingFixtures = [
  {id:'g4', scores:[4.7,4.8,4.5,4.5,4.5]},
  {id:'g1', scores:[4.8,4.9,4.3,4.3,4.2]},
  {id:'a1', scores:[4.6,4.6,4.4,4.2,4.2]},
  {id:'g2', scores:[4.2,4.1,4.7,4.3,4.2]},
  {id:'g5', scores:[4.5,4.0,4.4,4.2,3.9]}
];
let rankSource='current';
function renderRanking(){
  const target=document.getElementById('ranking'); if(!target)return;
  const axis=document.getElementById('axis').value;
  const index={sauna:0,water:1,rest:2,clean:3,route:4}[axis];
  const rows=(rankSource==='old'?[{id:'g1',scores:[4.5,4.5,4.5,4.5,2.5]},{id:'g2',scores:[4,4,4,4,2.5]}]:rankingFixtures)
    .map(r=>({...r,value:index===undefined?r.scores.reduce((a,b)=>a+b,0)*4:r.scores[index]})).sort((a,b)=>b.value-a.value||a.id.localeCompare(b.id));
  const label=rankSource==='old'?'（旧）':'';
  target.innerHTML=rows.map((r,i)=>i===0?`<div class="rank-first"><span class="rank-no">第一位</span><div><p class="caption">${axis==='total'?'総合点':'軸別 / 5点満点'}</p><h3>${esc(facility(r.id).name)}${label}</h3><div class="rank-score">${r.value.toFixed(1)}<small>点</small></div></div>${seal(r.id)}</div>`:`<div class="rank-row"><span class="mono">${i+1}</span><h3>${esc(facility(r.id).name)}${label}</h3><span class="mono">${r.value.toFixed(1)}</span></div>`).join('');
  document.getElementById('ranking-note').innerHTML=rankSource==='old'?'470sからの取り込みだけを表示（旧）。<br>上限90点・導線2.5固定。再換算しません。<br>表示例は2施設。空き順位を課題にしません。':'施設ごとの最新の採点付き訪問で比較。<br>470sの旧採点は混ぜず、別冊で見返せます。<br>旧採点は上限90点（導線2.5固定）の仕様。';
}
let searchFilter='all';
function renderResults(){
  const target=document.getElementById('results');if(!target)return;
  const query=document.getElementById('query').value.trim().normalize('NFKC').toLowerCase();
  const results=FACS.filter(f=>(f.name+f.city).normalize('NFKC').toLowerCase().includes(query)).filter(f=>searchFilter==='all'||(searchFilter==='cold'?f.wmin<10:f.rest?.outdoor));
  document.getElementById('result-count').innerHTML=`表示見本 <span class="mono">${results.length}</span> 件`;
  target.innerHTML=results.length?results.slice(0,3).map((f,i)=>i===0?`<article class="find-feature"><p class="kicker">${esc(f.city)} / 施設情報</p><div class="row"><h3>${esc(f.name)}</h3>${seal(f.id)}</div><div class="temp-row"><div><small>サウナ</small><br><strong>${f.smax}</strong><small> ℃</small></div><div><small>水風呂</small><br><strong>${f.wmin}</strong><small> ℃</small></div></div><button class="secondary" data-open-facility="${f.id}">施設のページへ →</button></article>`:`<article class="find-item">${seal(f.id)}<div><h3>${esc(f.name)}</h3><p class="caption">${esc(f.city)} · 水風呂 <span class="mono">${f.wmin}</span>℃</p></div></article>`).join('')+(results.length>3?`<p class="caption">ほか ${results.length-3} 件（一覧の続き）</p>`:''):'<div class="paper"><h3>該当する湯がありません</h3><p class="caption">名称を短くするか、条件を外してみてください。</p></div>';
}
renderRanking();renderResults();
document.getElementById('query')?.addEventListener('input',renderResults);
document.getElementById('axis')?.addEventListener('change',renderRanking);
document.getElementById('wellness')?.addEventListener('input',e=>{
  document.getElementById('wellness-value').textContent=Number(e.target.value).toFixed(1);
  const n=Number(e.target.value);
  document.querySelector('.stars').innerHTML=starsMarkup(n);
});
document.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.dataset.rankSource){rankSource=b.dataset.rankSource;document.querySelectorAll('[data-rank-source]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderRanking();}
  if(b.dataset.filter){searchFilter=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderResults();}
  if(b.hasAttribute('data-clear-rating')){document.getElementById('wellness-value').textContent='未記録';document.querySelector('.stars').innerHTML=starsMarkup(0);}
  if(b.dataset.nav){const map={book:'01-stamp',search:'04-find',shelf:'02-shelf',log:'03-ranking'};location.search='?cut='+map[b.dataset.nav];}
  if(b.dataset.openFacility==='g4')location.search='?cut=05-facility';
  else if(b.dataset.openFacility)alert('この施設ページは未作成です。今回の施設ページの見本は新岐阜サウナです。');
  if(b.hasAttribute('data-finish'))alert('ここで終了できます。最新の一印を見せる帳へ戻る導線です。帳のカットは今回の依頼範囲外です。');
  if(b.dataset.demoAction)alert(b.dataset.demoAction);
});
