// QA only: Playwright is not loaded by the deliverable HTML.
const { chromium } = require('playwright');
const { createServer } = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '../../..');
const ids = ['01-stamp','02-shelf','03-ranking','04-find','05-facility'];
const types = {'.html':'text/html','.css':'text/css','.js':'text/javascript','.webp':'image/webp'};
const server = createServer((req,res)=>{
  const file = path.resolve(root, '.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,body)=>{res.writeHead(err?404:200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':body);});
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM_PATH||undefined});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1});
  const page=await context.newPage();
  const errors=[],external=[];
  page.on('pageerror',e=>errors.push(String(e)));
  page.on('console',msg=>{if(['error','warning'].includes(msg.type()))errors.push(msg.text());});
  page.on('request',r=>{if(!r.url().startsWith(origin))external.push(r.url());});
  const url=id=>`${origin}/assets/totonoi/five-jobs/index.html?cut=${id}`;
  const report={viewports:[],interactions:[],externalRequests:external,errors};
  try{
    for(const id of ids){
      await page.setViewportSize({width:390,height:844});
      await page.goto(url(id));await page.evaluate(()=>document.fonts.ready);
      await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
      await page.locator('.screen').screenshot({path:path.join(__dirname,id+'.png')});
      const geom=await page.locator('.content').evaluate(el=>({height:el.clientHeight,scroll:el.scrollHeight}));
      assert.equal(geom.scroll,geom.height,`${id}: all review content must fit at 390`);
      report.viewports.push({id,width:390,...geom});
      assert.equal(await page.locator('.screen').evaluate(el=>el.getBoundingClientRect().height),844);
      for(const width of [320,375,414,768]){
        await page.setViewportSize({width,height:844});
        const test=await page.evaluate(()=>({
          overflow:document.documentElement.scrollWidth>innerWidth,
          contentOverflow:[...document.querySelectorAll('.content')].some(el=>el.scrollWidth>el.clientWidth),
          wide:[...document.querySelectorAll('button')].filter(el=>el.scrollWidth>el.clientWidth+1).map(el=>el.textContent.trim())
        }));
        assert.equal(test.overflow,false,`${id} root overflow ${width}`);
        assert.equal(test.contentOverflow,false,`${id} content overflow ${width}`);
        assert.deepEqual(test.wide,[],`${id} button overflow ${width}`);
      }
    }
    await page.goto(url('01-stamp'));
    assert.equal(await page.locator('#wellness').getAttribute('step'),'0.5');
    await page.locator('#wellness').fill('0');await page.locator('#wellness').dispatchEvent('input');
    assert.equal(await page.locator('#wellness-value').textContent(),'0.0');
    await page.locator('[data-clear-rating]').click();assert.equal(await page.locator('#wellness-value').textContent(),'未記録');
    await page.locator('#wellness').fill('5');await page.locator('#wellness').dispatchEvent('input');
    assert.equal(await page.locator('#wellness-value').textContent(),'5.0');
    report.interactions.push('wellness: 0, 5, half-step and unset are independent');
    await page.goto(url('03-ranking'));
    assert.equal(await page.locator('.rank-row').count(),4);
    await page.locator('#axis').selectOption('water');
    assert.match(await page.locator('.rank-first').textContent(),/大垣サウナ/);
    await page.locator('[data-rank-source="old"]').click();
    assert.match(await page.locator('.rank-first').textContent(),/（旧）/);
    assert.match(await page.locator('#ranking-note').textContent(),/90点/);
    report.interactions.push('ranking: five rows, axis changes winner, old scores isolated');
    await page.goto(url('04-find'));
    await page.locator('#query').fill('新岐阜');assert.equal(await page.locator('.find-feature').count(),1);assert.equal(await page.locator('.find-item').count(),0);
    await page.locator('#query').fill('該当なし');assert.match(await page.locator('#results').textContent(),/該当する湯がありません/);
    await page.locator('#query').fill('');await page.locator('[data-filter="outdoor"]').click();assert.match(await page.locator('#results').textContent(),/恵みの湯/);
    report.interactions.push('find: name, empty result, outdoor filter');
    assert.equal(await page.evaluate(()=>localStorage.length),0);
    assert.deepEqual(await page.evaluate(async()=>await indexedDB.databases()),[]);
    report.interactions.push('no localStorage or IndexedDB writes');
    await page.goto(`${origin}/assets/totonoi/five-jobs/index.html`);
    for(const width of [320,375,414,768,1280]){
      await page.setViewportSize({width,height:900});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
    fs.writeFileSync(path.join(__dirname,'verification.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify(report,null,2));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
