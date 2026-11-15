const {webkit, chromium, devices} = require('playwright');
const PANELS = ['account','advent','album','auction','build','camp','event','exp:stable','expand','fish','games','lab','lights','lore','market','mine','missions','museum','orders','pass','pet','profile','save','shop','stock','todo','train','shop:skins','shop:offers','bld:santa','bld:sawmill','bld:workshop','bld:stable','bld:cabin','bld:storage','bld:bakery','craft:workshop','info:lantern'];
(async () => {
  const out = [];
  for (const [tag, eng, opt] of [['se', webkit, devices['iPhone SE']], ['pc', chromium, {viewport: {width: 1440, height: 900}}]]){
    const b = await eng.launch(eng === chromium ? (process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {}) : {}); const p = await (await b.newContext({...opt, deviceScaleFactor: 1})).newPage();
    p.on('pageerror', e => out.push(`${tag} PAGEERR ${e.message}`));
    await p.addInitScript(require('./invite.cjs')); await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(2000);
    for (let i = 0; i < 10; i++){ await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); document.querySelector('.tskip')?.click(); }); await p.waitForTimeout(600); } await p.waitForTimeout(500);
    await p.evaluate(() => { const S = __v2.S; S.lvl = 30; S.coins = 5e5; S.wood = 5e5; S.cookies = 2e5; S.stars = 900; S.objs.find(o => o.type === 'santa').lv = 18; S.pet = {lv: 22, xp: 0, pat: 0};
      const add = (type, x, y) => S.objs.push({id: 'a' + type, type, x, y, lv: 5, t: Date.now() - 9e6, q: []});
      S.objs = S.objs.filter(o => !o.wild); add('workshop', 27, 24); add('stable', 12, 25); add('storage', 26, 11); add('mine', 9, 13); add('library', 31, 26); add('station', 31, 13); add('bakery', 9, 19); });
    for (const pn of PANELS){
      const [name, arg] = pn.split(':');
      await p.evaluate(() => { const s = document.querySelector('#sheet'); if (s) s.scrollTop = 0; });
      const ok = await p.evaluate(([name, arg]) => { try { const S = __v2.S; const o = arg && S.objs.find(x => x.type === arg);
        if (name === 'expand') __v2.openPanel('expand', {cx: 3, cy: 1}); else if (name === 'info'){ S.objs.push({id: 'ln', type: 'lantern', x: 20, y: 30}); __v2.openPanel('info', S.objs.find(x => x.id === 'ln')); }
        else __v2.openPanel(name, o || arg || undefined); return true; } catch(e){ return 'ERR ' + e.message; } }, [name, arg]);
      await p.waitForTimeout(450);
      if (ok !== true){ out.push(`${tag} ${pn} ${ok}`); continue; }
      const issues = await p.evaluate(() => {
        const sh = document.querySelector('#sheet'), R = sh.getBoundingClientRect(), res = [];
        const all = [...sh.querySelectorAll('*')].filter(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed');
        const txt = e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
        for (const e of all){ const cs = getComputedStyle(e), r = e.getBoundingClientRect(); if (!r.width || !r.height) continue;
          const name = (e.className && typeof e.className === 'string' ? '.' + e.className.split(' ')[0] : e.tagName) + ' «' + (e.innerText || '').trim().slice(0, 30).replace(/\n/g, ' ') + '»';
          if (txt(e) && e.scrollWidth > e.clientWidth + 2 && cs.overflow !== 'visible' && cs.textOverflow !== 'ellipsis') res.push('COUPÉ ' + name);
          if (txt(e) && (r.right > R.right + 2 || r.left < R.left - 2)) res.push('DÉBORDE ' + name);
        }
        // textes qui se chevauchent (feuilles avec texte)
        const foot = sh.querySelector('.foot'), fr = foot && foot.getBoundingClientRect();
        const vis = r => r.bottom > R.top + 50 && r.top < (fr ? fr.top : R.bottom);
        const leaves = all.filter(e => txt(e) && !e.closest('.foot') && !(e.closest('details:not([open])') && !e.closest('summary')) && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e).opacity !== '0').map(e => { const rg = document.createRange(); rg.selectNodeContents(e); return {e, rs: [...rg.getClientRects()].filter(r => r.width > 2 && vis(r))}; }).filter(x => x.rs.length);
        const fl = all.filter(e => txt(e) && e.closest('.foot')).map(e => { const rg = document.createRange(); rg.selectNodeContents(e); return {e, rs: [...rg.getClientRects()].filter(r => r.width > 2)}; });
        const hit = (A, B) => A.some(a => B.some(b => Math.min(a.right, b.right) - Math.max(a.left, b.left) > 3 && Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top) > 3));
        const L = leaves.concat(fl);
        for (let i = 0; i < L.length; i++) for (let j = i + 1; j < L.length; j++){ const a = L[i], b = L[j]; if (a.e.contains(b.e) || b.e.contains(a.e)) continue;
          if (hit(a.rs, b.rs)) res.push('CHEVAUCHE «' + a.e.innerText.trim().slice(0, 24).replace(/\n/g, ' ') + '» / «' + b.e.innerText.trim().slice(0, 24).replace(/\n/g, ' ') + '»'); }
        return [...new Set(res)].slice(0, 12);
      });
      if (issues.length) out.push(`${tag} ${pn}:\n   ` + issues.join('\n   '));
      if (issues.length) await p.screenshot({path: `out/${tag}-${pn.replace(':', '_')}.png`});
      await p.evaluate(() => document.querySelector('#veil')?.click()); await p.waitForTimeout(150);
    }
    await b.close();
  }
  console.log(out.join('\n') || 'aucun problème');
})();
