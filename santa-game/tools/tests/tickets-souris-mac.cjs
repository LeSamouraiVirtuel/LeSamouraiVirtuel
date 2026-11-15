// PC à la souris : plus de tickets → remplir (étoiles) → jouer la Tour de cadeaux → gains crédités ; bataille : viseur au curseur, clics = tirs
const {webkit: chromium} = require('playwright');
(async () => { const b = await chromium.launch(); const p = await (await b.newContext({viewport: {width: 1440, height: 900}, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Safari/605.1.15'})).newPage(); const log = [];
  p.on('pageerror', e => log.push('PAGEERR ' + e.message));
  await p.goto('http://localhost:8765/'); await p.waitForFunction(() => window.__v2, null, {timeout: 600000}); await p.waitForTimeout(1500);
  await p.evaluate(() => { document.querySelector('#cine .cskip')?.click(); }); await p.waitForTimeout(500); await p.evaluate(() => document.querySelector('.tskip')?.click()); await p.waitForTimeout(800);
  await p.evaluate(() => { const S = __v2.S; S.lvl = 13; S.stars = 100; S.games = {tickets: 0, t: Date.now(), best: {}}; S.cookies = 9000; });
  await p.evaluate(() => __v2.openPanel('games')); await p.waitForTimeout(600); await p.screenshot({path: 'out/mac-tix-panel.png'});
  await p.click('[data-a=play][data-k=snow]'); await p.waitForTimeout(500); await p.screenshot({path: 'out/mac-tix-modal.png'});
  await p.click('#modal [data-m=buy]'); await p.waitForSelector('.mg-go', {timeout: 8000}); log.push('tickets achetés, étoiles ' + await p.evaluate(() => __v2.S.stars) + ', tickets ' + await p.evaluate(() => __v2.S.games.tickets));
  await p.click('.mg-go'); await p.waitForTimeout(500);
  for (let k = 0; k < 8; k++){ await p.waitForFunction(() => { const c = __stack.cur(), t = __stack.top(); return c && Math.abs(c.x - t.x) < 2.5; }, null, {timeout: 20000, polling: 'raf'}).catch(() => {}); await p.mouse.click(720, 450); await p.waitForTimeout(150); }
  await p.waitForFunction(() => { const c = __stack.cur(), t = __stack.top(); return c && (c.x > t.x + t.w + 5 || c.x + c.w < t.x - 5); }, null, {timeout: 20000, polling: 'raf'}).catch(() => {}); await p.mouse.click(720, 450);
  await p.waitForSelector('.mg-claim', {timeout: 10000}); const c0 = await p.evaluate(() => __v2.S.coins); await p.screenshot({path: 'out/mac-tix-fin.png'});
  await p.click('.mg-claim'); await p.waitForTimeout(1200); log.push('Tour de cadeaux : pièces ' + c0 + ' → ' + await p.evaluate(() => __v2.S.coins));
  // bataille à la souris
  await p.evaluate(() => { __v2.S.camps = {at: 0, st: {}}; __v2.openPanel('camp'); }); await p.waitForTimeout(400);
  await p.click('[data-a="campgo"][data-i="0"]'); await p.waitForSelector('.mg-go', {state: 'visible', timeout: 60000}); await p.click('.mg-go'); await p.waitForTimeout(2500);
  let shots = 0; const t0 = Date.now();
  while (Date.now() - t0 < 40000 && !(await p.$('.mg-claim'))){
    if (await p.$('.b-cards:not([hidden])')){ await p.click('.b-cards [data-c]', {force: true}); await p.waitForTimeout(300); continue; }
    const tg = await p.evaluate(() => { const f = __b3.foes.filter(f => !f.dead).sort((a, b) => b.o.position.z - a.o.position.z)[0]; return f ? __b3.screen(f.o.position) : null; });
    if (tg){ await p.mouse.move(tg.x, tg.y); await p.mouse.click(tg.x, tg.y); shots++; } await p.waitForTimeout(250); }
  log.push('bataille souris : ' + shots + ' clics, monstres vaincus ' + await p.evaluate(() => __b3.killed) + (await p.$('.mg-claim') ? ' · terminée' : ''));
  await p.screenshot({path: 'out/mac-souris-bataille.png'}); console.log(log.join('\n')); await b.close(); })();
