// QA only. Requires Playwright; the delivered HTML has no dependencies.
const {chromium} = require('playwright');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {createServer} = require('node:http');
const root=__dirname;
const mime={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png'};
const server=createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=path.resolve(root,'.'+decodeURIComponent(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,body)=>{res.writeHead(err?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(err?'Not found':body);});
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const origin=`http://127.0.0.1:${server.address().port}`;
  const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||undefined,headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,reducedMotion:'reduce'});
  const page=await context.newPage();
  const report={date:new Date().toISOString(),screens:[],interactions:[],contrast:[],errors:[],externalRequests:[],storageWrites:[]};
  page.on('pageerror',e=>report.errors.push(String(e)));
  page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());});
  page.on('request',r=>{if(!r.url().startsWith(origin)&&!r.url().startsWith('data:'))report.externalRequests.push(r.url());});
  await context.exposeBinding('recordWrite',(_,v)=>report.storageWrites.push(v));
  await context.addInitScript(()=>{
    const original=Storage.prototype.setItem;
    Storage.prototype.setItem=function(k,v){window.recordWrite(k);return original.call(this,k,v);};
  });
  async function ready(){await page.evaluate(()=>document.fonts.ready);await page.locator('img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));}
  try {
    for(const theme of ['a','b','c'])for(const screen of ['shelf','rank']) {
      const entry={theme,screen,widths:[]};
      for(const width of [320,375,390,414,768]) {
        await page.setViewportSize({width,height:844});
        await page.goto(`${origin}/?theme=${theme}&screen=${screen}`);await ready();
        const geometry=await page.evaluate(()=>({
          overflow:document.documentElement.scrollWidth>innerWidth,
          outside:[...document.querySelectorAll('.screen button,.screen a,.screen select')].filter(el=>{const r=el.getBoundingClientRect();return r.width&& (r.left<0||r.right>innerWidth+.5);}).map(el=>el.textContent.trim()),
          clipped:[...document.querySelectorAll('button:not(.seal-button):not([data-gallery]),a,select,h1,h2,.label,.location')].filter(el=>el.offsetWidth&&el.scrollWidth>el.clientWidth+1).map(el=>el.textContent.trim()),
          height:document.querySelector('.screen').getBoundingClientRect().height,
          images:[...document.querySelectorAll('.screen img')].map(i=>({src:i.getAttribute('src'),loaded:i.complete&&i.naturalWidth===1254,width:Math.round(i.getBoundingClientRect().width)}))
        }));
        assert.equal(geometry.overflow,false,`${theme}/${screen}/${width}: root overflow`);
        assert.deepEqual(geometry.outside,[],`${theme}/${screen}/${width}: offscreen control`);
        assert.deepEqual(geometry.clipped,[],`${theme}/${screen}/${width}: clipped text`);
        assert(geometry.images.every(i=>i.loaded),'images must decode');
        if(width===390){
          assert.equal(geometry.height,844,`${theme}/${screen}: 844px cut`);
          await page.locator('.screen').screenshot({path:path.join(root,`${theme}-${screen}.png`)});
        }
        entry.widths.push({width,...geometry});
      }
      report.screens.push(entry);
      await page.setViewportSize({width:390,height:844});
      if(screen==='rank') {
        await page.locator('[data-axis]').selectOption('rest');
        assert.equal(await page.locator('.rank-row').first().getAttribute('data-id'),'g6');
        await page.locator('[data-axis]').selectOption('sauna');
        assert.equal(await page.locator('.rank-row').first().getAttribute('data-id'),'a9');
        await page.locator('.legacy summary').click();
        assert.match(await page.locator('.legacy').innerText(),/現在の順位には混ぜません/);
        report.interactions.push(`${theme}: ranking axes reorder fixture, legacy stays separate`);
      }
      await page.locator('[data-facility]').first().click();
      assert(await page.locator('dialog').isVisible());
      await page.keyboard.press('Escape');
      assert.equal(await page.locator('dialog').isVisible(),false);
      assert.equal(await page.evaluate(()=>document.activeElement.hasAttribute('data-facility')),true);
      report.interactions.push(`${theme}/${screen}: image modal, Escape and focus return`);
    }
    await page.goto(`${origin}/?theme=c&screen=shelf`);
    await page.locator('[data-gallery="g6"]').click();
    assert.equal(await page.locator('[data-gallery-title]').innerText(),'湯どころ みのり');
    assert.equal(await page.locator('[data-gallery="g6"]').getAttribute('aria-pressed'),'true');
    report.interactions.push('gallery: thumbnail selection updates art, title and position');
    await page.locator('.nav a').nth(1).click();
    assert.match(page.url(),/screen=rank/);
    report.interactions.push('shelf/ranking navigation works');
    for(const screen of ['shelf','rank']){
      await page.setViewportSize({width:1280,height:960});
      await page.goto(`${origin}/?board=${screen}`);await ready();
      const contrast=await page.locator('.screen').evaluateAll(screens=>screens.flatMap(s=>{
        const css=getComputedStyle(s),canvas=document.createElement('canvas');canvas.width=canvas.height=1;
        const ctx=canvas.getContext('2d',{willReadFrequently:true});
        const luminance=color=>{ctx.clearRect(0,0,1,1);ctx.fillStyle=color;ctx.fillRect(0,0,1,1);const v=[...ctx.getImageData(0,0,1,1).data].slice(0,3).map(c=>{c/=255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;});return v[0]*.2126+v[1]*.7152+v[2]*.0722;};
        const pairs=[['ink','paper',4.5],['muted','paper',4.5],['ink','surface',4.5],['muted','surface',4.5],['accent-ink','accent',4.5],['focus','paper',3]];
        if(s.dataset.theme==='b')pairs.push(['ink','wood',4.5],['muted','wood-lit',4.5]);
        const result=pairs.map(([a,b,min])=>{const x=luminance(css.getPropertyValue('--color-'+a)),y=luminance(css.getPropertyValue('--color-'+b));return {theme:s.dataset.theme,pair:`${a}/${b}`,ratio:(Math.max(x,y)+.05)/(Math.min(x,y)+.05),min};});
        const h=s.querySelector('h1');const x=luminance(getComputedStyle(h).color),y=luminance(css.backgroundColor);
        result.push({theme:s.dataset.theme,pair:'rendered heading/screen',ratio:(Math.max(x,y)+.05)/(Math.min(x,y)+.05),min:4.5});
        return result;
      }));
      contrast.forEach(c=>assert(c.ratio>=c.min,JSON.stringify(c)));report.contrast.push(...contrast);
      await page.locator('.comparison').screenshot({path:path.join(root,`compare-${screen}.png`)});
      if(process.env.QA_DIR)for(const width of [320,375,414,768]){
        fs.mkdirSync(process.env.QA_DIR,{recursive:true});
        await page.setViewportSize({width:width*3+80,height:1000});
        await page.addStyleTag({content:`.comparison{max-width:none}.comparison-grid{grid-template-columns:repeat(3,minmax(0,${width}px))}`});
        await page.locator('.comparison').screenshot({path:path.join(process.env.QA_DIR,`${screen}-${width}.png`)});
      }
    }
    for(const width of [320,375,414,768,1280]){
      await page.setViewportSize({width,height:900});await page.goto(origin);
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    }
    assert.equal(await page.evaluate(()=>localStorage.length+sessionStorage.length),0);
    assert.deepEqual(await page.evaluate(()=>indexedDB.databases()),[]);
    assert.deepEqual(report.errors,[]);assert.deepEqual(report.externalRequests,[]);assert.deepEqual(report.storageWrites,[]);
    fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2)+'\n');
    console.log(JSON.stringify({screens:report.screens.length,viewports:report.screens.length*5,interactions:report.interactions,errors:report.errors,externalRequests:report.externalRequests,storageWrites:report.storageWrites},null,2));
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
