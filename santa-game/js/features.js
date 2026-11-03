// Panneaux « méta » : connexion quotidienne, événement du jour, cadeaux et rareté, album,
// boutique, garde-robe, profil, classement et guildes.
// Reçoit de main.js un contexte `C` (état, règles, utilitaires d'interface).
import * as G from './game.js';
import {EMBLEMS, GUILD_COLORS} from './net.js';

const {TOYS, RARITY, PAPERS, SKINS, SKIN_CATS, PRODUCTS} = G;
const dayKey = d => `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return dayKey(d); };
const esc = s => String(s).replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'}[c]));

export function installFeatures(C){
  const S = () => C.state;
  const {R, fmt, fmtTime, ic, chips, rwChips, ICON} = C;
  const header = (small, title) => `<div class="hd"><div class="tt"><small>${small}</small><h2>${title}</h2></div><button class="x" data-a="close" aria-label="Fermer"></button></div>`;
  const tabs = (name, list, cur) => `<div class="tabs">${list.map(([k, l]) => `<button class="${k === cur ? 'on' : ''}" data-a="tab" data-tab="${name}" data-v="${k}">${l}</button>`).join('')}</div>`;
  const ui = {rankTab: 'players', hotteTab: 'gifts', wardTab: 'santa', wrapToy: null, wrapPaper: 'kraft'};
  const rar = r => `<span class="rar" style="--rc:${RARITY[r].color}">${RARITY[r].name}</span>`;

  /* =================================================================
     SEMAINE, ÉVÉNEMENT
     ================================================================= */
  function week(){ const wk = G.weekKey(), s = S(); if (s.week.key !== wk) s.week = {key: wk, xp: 0, tour: 0}; return s.week; }
  function ev(){
    const s = S(), d = G.today();
    if (s.event.day !== d) Object.assign(s.event, {day: d, pts: 0, claimed: [], claimedP: [], board: null});
    return s.event;
  }
  function addEventPts(n){ if (n > 0){ ev().pts += Math.round(n); } }
  function onTrack(kind, n){
    if (G.eventToday().k === 'rush'){ const pts = {crafted: 10, letters: 50, delivered: 30}[kind]; if (pts) addEventPts(pts * n); }
  }
  function tickEnergy(now){
    const e = ev(), max = R.energyMax();
    if (e.energy >= max) e.energyT = now;
    else while (e.energy < max && now - e.energyT >= G.ENERGY_MS){ e.energy++; e.energyT += G.ENERGY_MS; }
  }
  function spendEnergy(){
    const e = ev();
    if (e.energy < 1){ C.sfx.err(); C.toast("Plus de clochettes : elles se rechargent toutes les 20 min, ou recharge avec des étoiles"); return false; }
    if (e.energy >= R.energyMax()) e.energyT = Date.now();
    e.energy--; return true;
  }

  /* =================================================================
     CONNEXION QUOTIDIENNE
     ================================================================= */
  function loginStatus(){
    const L = S().login, t = G.today();
    if (L.claimed === t) return {claimed: true, next: L.streak};
    const continues = L.last === yesterday();
    return {claimed: false, continues, broken: !!L.last && !continues && L.streak >= 3, next: continues ? L.streak + 1 : 1};
  }
  const loginReady = () => !loginStatus().claimed;
  function claimLogin(el){
    const st = loginStatus(); if (st.claimed) return;
    const L = S().login;
    L.streak = st.next; L.best = Math.max(L.best, L.streak); L.total++; L.last = G.today(); L.claimed = G.today();
    const rw = G.loginReward(L.cycle, R.pl()); L.cycle++;
    C.gain(rw, el);
    const bonus = G.streakBonus(L.streak);
    if (bonus){ setTimeout(() => { C.gain(bonus, el); C.toast(`Série de ${L.streak} jours ! Bonus débloqué`); }, 700); }
    C.sfx.bells(); C.save();
  }
  function saveStreak(){
    const L = S().login, st = loginStatus();
    if (!st.broken) return;
    if (S().stars < G.SAVE_STREAK_COST){ C.sfx.err(); C.toast("Pas assez d'étoiles"); return; }
    S().stars -= G.SAVE_STREAK_COST; L.last = yesterday(); C.sfx.collect(); C.toast(`Série de ${L.streak} jours sauvée !`);
  }
  function loginHtml(){
    const st = loginStatus(), L = S().login;
    const cur = st.claimed ? (L.cycle - 1) % 7 : L.cycle % 7;
    const days = Array.from({length: 7}, (_, i) => {
      const rw = G.loginReward(L.cycle - cur + i, R.pl());
      const state = i < cur || (i === cur && st.claimed) ? 'done' : i === cur ? 'today' : '';
      return `<div class="lday ${state} ${i === 6 ? 'big' : ''}"><small>Jour ${i + 1}</small><span class="dr">${Object.keys(rw).map(k => ic(k)).join('')}</span><b>${Object.values(rw).map(fmt).join(' + ')}</b>${state === 'done' ? '<span class="tick"></span>' : ''}</div>`;
    }).join('');
    const ms = Object.keys(G.STREAK).map(Number);
    const nextM = ms.find(m => m > L.streak) || (Math.floor(L.streak / 50) + 1) * 50;
    const nb = G.streakBonus(nextM);
    return `${header('Bonus de connexion', 'Connexion du jour')}
      <div class="streak"><span class="flame"></span><div><b>${st.claimed ? L.streak : st.next} jour${(st.claimed ? L.streak : st.next) > 1 ? 's' : ''} d'affilée</b><small>Record : ${L.best} · ${L.total} connexions au total</small></div></div>
      ${st.broken ? `<div class="warn">Ta série de ${L.streak} jours s'est arrêtée hier. <button class="btn gold sm" data-a="saveStreak">Sauver · ${ic('stars')}${G.SAVE_STREAK_COST}</button></div>` : ''}
      <div class="ldays">${days}</div>
      <div class="row"><span>Prochain palier : ${nextM} jours</span><b>${nb ? rwChips(nb) : ''}${nb?.skin ? ' + tenue' : ''}</b></div>
      <div class="acts"><button class="btn green" data-a="loginClaim" ${st.claimed ? 'disabled' : ''}>${st.claimed ? 'Reviens demain !' : 'Récupérer'}</button></div>`;
  }

  /* =================================================================
     ÉVÉNEMENT DU JOUR
     ================================================================= */
  function newBoard(){
    return Array.from({length: 9}, () => null);
  }
  function huntReward(){
    const r = Math.random(), m = Math.pow(1.25, R.pl() / 2);
    if (r < .04) return {r: 3, rw: {stars: 25}};
    if (r < .17) return {r: 2, rw: {stars: 5 + Math.floor(Math.random() * 6)}};
    if (r < .45) return {r: 1, rw: Math.random() < .5 ? {tickets: 1} : {fabric: Math.round(60 * m)}};
    const k = ['coins', 'wood', 'cookies'][Math.floor(Math.random() * 3)];
    return {r: 0, rw: {[k]: Math.round((k === 'coins' ? 220 : 140) * m)}};
  }
  function eventHtml(){
    const E = G.eventToday(), e = ev(), max = R.energyMax(), pass = R.passOn();
    const midnight = new Date(); midnight.setHours(24, 0, 0, 0);
    const bells = Array.from({length: max}, (_, i) => `<i class="bell ${i < e.energy ? 'on' : ''}"></i>`).join('');
    let action = '';
    if (E.k === 'hunt'){
      if (!e.board || e.board.every(Boolean)) e.board = newBoard();
      action = `<div class="hunt">${e.board.map((b, i) => b ? `<div class="hbox open" style="--rc:${RARITY[b.r].color}"><span class="dr">${Object.keys(b.rw).map(k => ic(k)).join('')}</span><b>${Object.values(b.rw).map(fmt).join('')}</b></div>` : `<button class="hbox" data-a="hunt" data-i="${i}"><img src="${ICON.gift}" alt="Paquet mystère"></button>`).join('')}</div>`;
    } else {
      action = `<button class="btn green wide" data-a="eventGo">${E.action} · <i class="i bell on"></i>1</button>`;
    }
    const tiers = G.EVENT_TIERS.map((t, i) => {
      const {free, prem} = G.eventRewards(i, R.pl()), ok = e.pts >= t;
      const fc = e.claimed.includes(i), pc = e.claimedP.includes(i);
      return `<div class="tier ${ok ? 'ok' : ''}"><b>${fmt(t)}</b>
        <button class="trw ${fc ? 'got' : ''}" data-a="tierFree" data-i="${i}" ${ok && !fc ? '' : 'disabled'}>${rwChips(free)}</button>
        <button class="trw prem ${pc ? 'got' : ''} ${pass ? '' : 'lock'}" data-a="tierPrem" data-i="${i}" ${ok && !pc && pass ? '' : 'disabled'}>${rwChips(prem)}</button></div>`;
    }).join('');
    const nextT = G.EVENT_TIERS.find(t => t > e.pts) || G.EVENT_TIERS.at(-1);
    return `${header(`Événement du jour · fin dans <b data-until="${midnight.getTime()}"></b>`, E.name)}
      <p>${E.desc}</p>
      <div class="energy"><div class="bells">${bells}</div><span>${e.energy >= max ? 'Clochettes au maximum' : `+1 dans <b data-until="${e.energyT + G.ENERGY_MS}"></b>`}</span><button class="mini" data-a="refill">Recharger · ${ic('stars')}15</button></div>
      ${action}
      <div class="evpts"><b>${fmt(e.pts)} points</b><span class="mbar"><i style="width:${Math.min(100, e.pts / nextT * 100)}%"></i></span></div>
      <div class="tiers"><div class="tier head"><b>Palier</b><span>Gratuit</span><span>Pass des Fêtes ${pass ? '' : '<button class="mini" data-a="shop">Obtenir</button>'}</span></div>${tiers}</div>`;
  }
  function eventGo(){
    const E = G.eventToday();
    if (E.k === 'rush'){
      const ws = Object.values(S().plots).find(p => p.type === 'workshop' && p.queue?.length);
      if (!ws){ C.sfx.err(); C.toast("Lance d'abord la fabrication d'un jouet à l'Atelier"); return; }
      if (!spendEnergy()) return;
      const q = ws.queue[0], dt = q.end - Date.now(); for (const it of ws.queue){ it.end -= dt; it.start = Math.min(it.start, it.end); }
      addEventPts(40); C.sfx.collect(); C.toast('Les lutins ont terminé le jouet ! +40 points');
      return;
    }
    if (E.k === 'sleigh' || E.k === 'snow'){
      if (ev().energy < 1){ spendEnergy(); return; }
      C.playGame(E.k, {event: true});
    }
  }
  function hunt(i, el){
    const e = ev(); if (!e.board || e.board[i]) return;
    if (!spendEnergy()) return;
    const b = huntReward(); e.board[i] = b; C.gain(b.rw, el); addEventPts(40 + b.r * 20);
    C.sfx[b.r >= 2 ? 'bells' : 'collect']();
    if (b.r >= 2) C.toast(`Paquet ${RARITY[b.r].name.toLowerCase()} !`);
  }
  function eventGameDone(kind, score){ addEventPts(kind === 'snow' ? score * 4 : score); }

  /* =================================================================
     CADEAUX, RARETÉ, ALBUM
     ================================================================= */
  function wrapHtml(p){
    const slots = G.slotsOf(p.lv), cells = [];
    for (const d of p.done) cells.push(`<div class="slot ready" style="--rc:${RARITY[d.r].color}"><img src="${ICON['present' + d.r]}" alt=""></div>`);
    p.queue.forEach((q, i) => cells.push(`<div class="slot ${i === 0 ? 'run' : ''}"><img src="${ICON.gift}" alt="">${i === 0 ? `<span class="sbar"><i data-prog="${q.start},${q.end}"></i></span><small data-until="${q.end}"></small>` : ''}</div>`));
    while (cells.length < slots) cells.push('<div class="slot empty"></div>');
    const toys = Object.keys(TOYS).filter(k => (S().toys[k] || 0) > 0);
    if (!toys.includes(ui.wrapToy)) ui.wrapToy = toys[0] || null;
    const toyPick = toys.length ? toys.map(k => `<button class="pick ${k === ui.wrapToy ? 'on' : ''}" data-a="wrapToy" data-t="${k}"><img src="${ICON['toy_' + k]}" alt=""><b>${S().toys[k]}</b></button>`).join('') : '<span class="meta">Aucun jouet : fabrique-en à l\'Atelier des lutins.</span>';
    const papers = Object.entries(PAPERS).map(([k, P]) => {
      const o = G.oddsFor(k, p.lv), locked = R.pl() < P.pl, tot = o.reduce((a, b) => a + b);
      return `<button class="paper ${k === ui.wrapPaper ? 'on' : ''} ${locked ? 'locked' : ''}" data-a="wrapPaper" data-t="${k}"><img src="${ICON['paper_' + k]}" alt=""><b>${P.name}</b>
        ${locked ? `<span class="why">Niveau ${P.pl}</span>` : `<span class="costs">${chips(P.cost)}</span>`}
        <span class="odds">${o.map((v, i) => `<i style="flex:${v};background:${RARITY[i].color}" title="${RARITY[i].name} ${Math.round(v / tot * 100)} %"></i>`).join('')}</span>
        <small>${o.map((v, i) => `${Math.round(v / tot * 100)}%`).join(' · ')}</small></button>`;
    }).join('');
    return `<h3>File d'emballage</h3><div class="slots">${cells.join('')}</div>
      ${p.done.length ? `<button class="btn gold wide" data-a="collect">Ouvrir ${p.done.length} cadeau${p.done.length > 1 ? 'x' : ''}</button>` : ''}
      <h3>1. Choisis un jouet</h3><div class="picks">${toyPick}</div>
      <h3>2. Choisis le papier</h3><div class="papers">${papers}</div>
      <p class="meta">Barre de chances : ${RARITY.map(r => rar(RARITY.indexOf(r))).join(' ')}</p>
      <button class="btn green wide" data-a="wrap" ${ui.wrapToy ? '' : 'disabled'}>Emballer</button>`;
  }
  function wrap(id){
    const p = S().plots[id], P = PAPERS[ui.wrapPaper], toy = ui.wrapToy;
    if (!toy || (S().toys[toy] || 0) < 1){ C.sfx.err(); C.toast('Choisis un jouet que tu possèdes'); return; }
    if (R.pl() < P.pl){ C.sfx.err(); C.toast(`Niveau joueur ${P.pl} requis`); return; }
    if (p.queue.length + p.done.length >= G.slotsOf(p.lv)){ C.sfx.err(); C.toast('File pleine : ouvre tes cadeaux ou améliore la salle'); return; }
    if (!R.canAfford(P.cost)){ C.sfx.err(); C.toast('Il te manque de quoi payer le papier'); return; }
    C.pay(P.cost); S().toys[toy]--;
    const r = G.rollRarity(ui.wrapPaper, p.lv);
    const start = Math.max(Date.now(), p.queue.length ? p.queue.at(-1).end : 0);
    p.queue.push({toy, r, paper: ui.wrapPaper, start, end: start + P.time * 1000 / G.craftSpeed(p.lv)});
    C.sfx.tap(); C.save();
  }
  function reveal(items){
    const best = Math.max(...items.map(i => i.r));
    const cards = items.map((it, i) => {
      const k = G.giftKey(it.toy, it.r);
      return `<div class="gcard" style="--rc:${RARITY[it.r].color};animation-delay:${i * .25}s"><img class="pr" src="${ICON['present' + it.r]}" alt=""><img class="ty" src="${ICON['toy_' + it.toy]}" alt="">${rar(it.r)}<small>${TOYS[it.toy].name}${it.isNew ? ' · <b>Nouveau !</b>' : ''}</small></div>`;
    }).join('');
    C.modal(`<small>Salle d'emballage</small><h2>${best >= 3 ? 'Légendaire !' : best === 2 ? 'Épique !' : 'Tes cadeaux'}</h2><div class="gcards">${cards}</div><button class="btn green" data-m="close">Super !</button>`, null, best >= 2 ? 'glow' : '');
    if (best >= 2) C.sfx.bells();
  }
  function deliver(key, el, all = false){
    const n = all ? S().gifts[key] : 1; if (!n) return;
    const [toy, r] = key.split(':'), ri = +r, rw = G.giftReward(toy, ri);
    const tot = {coins: rw.coins * n, xp: rw.xp * n}; if (rw.stars) tot.stars = rw.stars * n;
    S().gifts[key] -= n; if (!S().gifts[key]) delete S().gifts[key];
    const pts = G.giftPts(toy, ri) * n;
    if (S().guild){ week().tour += pts; }
    C.gain(tot, el); C.track('delivered', n); C.sfx.bells(); C.net.push();
    if (S().guild) C.toast(`+${fmt(pts)} points pour la Grande Tournée de ta guilde`);
    C.save();
  }
  function albumStats(){
    const keys = Object.keys(TOYS), total = keys.length * 4;
    const have = keys.reduce((a, k) => a + [0, 1, 2, 3].filter(r => S().album[G.giftKey(k, r)]).length, 0);
    return {have, total};
  }
  function hotteHtml(){
    const t = tabs('hotte', [['gifts', 'Cadeaux'], ['album', 'Album']], ui.hotteTab);
    if (ui.hotteTab === 'album'){
      const {have, total} = albumStats();
      const rows = Object.entries(TOYS).map(([k, T]) => {
        const cells = [0, 1, 2, 3].map(r => S().album[G.giftKey(k, r)] ? `<div class="acell" style="--rc:${RARITY[r].color}"><img src="${ICON['toy_' + k]}" alt=""></div>` : `<div class="acell no" style="--rc:${RARITY[r].color}"></div>`).join('');
        const full = [0, 1, 2, 3].every(r => S().album[G.giftKey(k, r)]), got = S().albumClaimed[k];
        return `<div class="arow"><b>${T.name}</b><div class="acells">${cells}</div>${got ? '<span class="tick"></span>' : `<button class="btn gold sm" data-a="albumClaim" data-t="${k}" ${full ? '' : 'disabled'}>${ic('stars')}20</button>`}</div>`;
      }).join('');
      return `${header(`Album · ${have}/${total}`, 'La Hotte')}${t}<p>Emballe chaque jouet dans les 4 raretés pour compléter une ligne. L'album complet débloque la tenue <b>Père Noël doré</b>.</p>
        <div class="mbar big"><i style="width:${have / total * 100}%"></i></div><div class="album">${rows}</div>`;
    }
    const keys = Object.keys(S().gifts).sort((a, b) => +b.split(':')[1] - +a.split(':')[1]);
    const g = C.net.guilds.find(x => x.id === S().guild);
    const cards = keys.map(k => {
      const [toy, r] = k.split(':'), rw = G.giftReward(toy, +r);
      return `<div class="gift" style="--rc:${RARITY[r].color}"><div class="gimg"><img class="pr" src="${ICON['present' + r]}" alt=""><img class="ty" src="${ICON['toy_' + toy]}" alt=""><b>x${S().gifts[k]}</b></div>
        ${rar(+r)}<small>${TOYS[toy].name}</small><span class="costs">${rwChips(rw)}</span>
        <span class="gbtns"><button class="btn green sm" data-a="deliver" data-k="${k}">Livrer</button>${S().gifts[k] > 1 ? `<button class="mini" data-a="deliverAll" data-k="${k}">Tous</button>` : ''}</span></div>`;
    }).join('');
    return `${header('Cadeaux emballés', 'La Hotte')}${t}
      <p>Livre tes cadeaux aux enfants. Plus le cadeau est rare, plus il rapporte.${g ? ` Chaque livraison ajoute aussi des points à la Grande Tournée de <b>${esc(g.name)}</b>.` : ' Rejoins une guilde pour que tes livraisons comptent dans la Grande Tournée.'}</p>
      <div class="gifts">${cards || '<span class="meta">Ta hotte est vide. Construis la Salle d\'emballage pour transformer tes jouets en cadeaux.</span>'}</div>`;
  }
  function claimAlbum(k, el){
    if (S().albumClaimed[k] || ![0, 1, 2, 3].every(r => S().album[G.giftKey(k, r)])) return;
    S().albumClaimed[k] = true; C.gain({stars: 20}, el);
    const {have, total} = albumStats();
    if (have === total && !S().owned.includes('santa:gold')){ C.gain({skin: 'santa:gold'}); C.toast('Album complet : tenue Père Noël doré débloquée !'); }
    C.sfx.bells();
  }

  /* =================================================================
     BOUTIQUE
     ================================================================= */
  function shopHtml(){
    const s = S(), m = Math.pow(1.25, R.pl() / 2), cap = R.storeCap();
    const offers = ['starter', 'pass'].filter(k => !(PRODUCTS[k].once && s.purchases[k])).map(k => {
      const P = PRODUCTS[k];
      return `<div class="offer ${k}"><div><small>${P.tag || (k === 'pass' && R.passOn() ? `Actif encore ${fmtTime((s.pass - Date.now()) / 1000)}` : 'Offre')}</small><b>${P.name}</b>
        ${P.perks ? `<ul>${P.perks.map(x => `<li>${x}</li>`).join('')}</ul>` : `<span class="costs">${rwChips(Object.fromEntries(Object.entries(P.give).filter(([k]) => k !== 'skin')))}${P.give.skin ? '<span class="chip">+ tenue Sapin</span>' : ''}</span>`}</div>
        <button class="btn gold" data-a="buy" data-p="${k}">${P.price}</button></div>`;
    }).join('');
    const packs = ['s1', 's2', 's3', 's4', 's5'].map(k => { const P = PRODUCTS[k]; return `<button class="pack" data-a="buy" data-p="${k}">${P.tag ? `<em>${P.tag}</em>` : ''}<img src="${ICON.shop}" alt=""><b>${fmt(P.give.stars)}</b><span>${P.price}</span></button>`; }).join('');
    const crate = (k, n, price) => `<button class="pack small" data-a="buyStar" data-k="${k}" data-n="${n}" data-c="${price}"><img src="${ICON[k] || ICON.shop}" alt=""><b>+${fmt(n)}</b><span>${ic('stars')}${price}</span></button>`;
    const q = n => Math.max(100, Math.round(Math.min(cap * .3, n * m) / 10) * 10);
    return `${header('Boutique', 'Boutique du Pôle')}
      ${offers}
      <h3>Étoiles</h3><div class="packs">${packs}</div>
      <p class="demo">Mode démo : aucun paiement réel n'est effectué. Dans l'app publiée, ces achats passeront par l'App Store ou Google Play.</p>
      <h3>Avec tes étoiles</h3><div class="packs">${crate('coins', q(1500), 20)}${crate('wood', q(1000), 20)}${crate('cookies', q(600), 20)}${crate('fabric', q(300), 25)}${crate('tickets', 3, 12)}</div>
      <button class="btn green wide" data-a="wardrobe">Tenues et skins</button>`;
  }
  function buy(k){
    const P = PRODUCTS[k];
    C.modal(`<small>Achat</small><h2>${P.name}</h2><p class="big">${P.price}</p><p>Ceci est une démo : aucun paiement réel. Dans l'app publiée, la confirmation passera par l'App Store ou Google Play.</p>
      <div class="acts"><button class="btn grey" data-m="close">Annuler</button><button class="btn green" data-m="ok">Simuler l'achat</button></div>`, a => {
      if (a !== 'ok') return;
      const g = {...P.give};
      if (g.pass){ g.pass = g.pass; }
      C.gain(g, document.querySelector('#stars')); S().purchases[k] = (S().purchases[k] || 0) + 1; C.sfx.bells(); C.save(); C.rerender();
    });
  }
  function buyStar(k, n, price, el){
    if (S().stars < price){ C.sfx.err(); C.toast("Pas assez d'étoiles"); C.openPanel('shop'); return; }
    S().stars -= price; C.gain({[k]: n}, el); C.sfx.collect(); C.save();
  }

  /* =================================================================
     GARDE-ROBE (cosmétiques)
     ================================================================= */
  function wardrobeHtml(){
    const cat = ui.wardTab, s = S();
    const cards = Object.entries(SKINS[cat]).map(([k, sk]) => {
      const id = `${cat}:${k}`, owned = s.owned.includes(id), on = s.skins[cat] === k;
      return `<div class="skin ${on ? 'on' : ''}" style="--rc:${RARITY[sk.r].color}"><img src="${C.skinIcon(cat, k)}" alt="">${rar(sk.r)}<b>${sk.name}</b>
        ${on ? '<span class="eq">Équipé</span>' : owned ? `<button class="btn green sm" data-a="equip" data-k="${id}">Équiper</button>` : sk.price ? `<button class="btn gold sm" data-a="buySkin" data-k="${id}">${ic('stars')}${sk.price}</button>` : `<span class="why">${sk.unlock}</span>`}</div>`;
    }).join('');
    return `${header('Cosmétiques', 'Garde-robe')}${tabs('ward', Object.entries(SKIN_CATS), cat)}<div class="skins">${cards}</div>`;
  }
  function buySkin(id){
    const [cat, k] = id.split(':'), sk = SKINS[cat][k];
    if (S().owned.includes(id)) return;
    if (S().stars < sk.price){ C.sfx.err(); C.toast("Pas assez d'étoiles"); C.openPanel('shop'); return; }
    S().stars -= sk.price; S().owned.push(id); S().skins[cat] = k; C.applySkins(); C.sfx.bells(); C.save();
  }
  function equip(id){ const [cat, k] = id.split(':'); if (!S().owned.includes(id)) return; S().skins[cat] = k; C.applySkins(); C.sfx.tap(); C.net.push(); C.save(); }

  /* =================================================================
     PROFIL
     ================================================================= */
  function profileHtml(){
    const s = S(), {have, total} = albumStats();
    const row = (a, b) => `<div class="row"><span>${a}</span><b>${b}</b></div>`;
    return `${header(G.rankOf(s.pl), esc(s.pseudo))}
      <div class="prof"><img src="${C.portraitNow()}" alt=""><div><b>Niveau ${s.pl}</b><small>${fmt(s.xp)} / ${fmt(G.xpNeed(s.pl))} XP</small><button class="mini" data-a="pseudo">Changer de pseudo</button></div></div>
      <div class="stats">${row('Série de connexions', `${s.login.streak} jours (record ${s.login.best})`)}${row('Album', `${have} / ${total}`)}${row('Lettres envoyées', fmt(s.stats.letters))}${row('Jouets fabriqués', fmt(s.stats.crafted))}${row('Cadeaux livrés', fmt(s.stats.delivered || 0))}${row('XP cette semaine', fmt(week().xp))}${row('Réseau', C.net.mode === 'online' ? 'En ligne (page partagée)' : 'Démo hors ligne')}</div>
      <button class="btn green wide" data-a="wardrobe">Garde-robe</button>`;
  }
  function editPseudo(){
    C.modal(`<small>Profil</small><h2>Ton pseudo</h2><input id="pseudoIn" maxlength="16" value="${esc(S().pseudo)}" aria-label="Pseudo"><p class="meta">Il apparaît dans le classement et ta guilde.</p>
      <div class="acts"><button class="btn grey" data-m="close">Annuler</button><button class="btn green" data-m="ok">Valider</button></div>`, a => {
      if (a !== 'ok') return;
      const v = document.querySelector('#pseudoIn').value.trim().replace(/\s+/g, ' ').slice(0, 16);
      if (v.length >= 2){ S().pseudo = v; C.net.push(true); C.save(); C.rerender(); }
    });
  }

  /* =================================================================
     CLASSEMENT
     ================================================================= */
  function netNote(){
    const n = C.net;
    if (n.mode === 'connecting') return '<p class="meta">Connexion…</p>';
    if (n.error) return `<p class="demo">${esc(n.error)}</p>`;
    return n.mode === 'online' ? '<p class="meta live">En direct avec les joueurs de cette page</p>' : '<p class="demo">Démo hors ligne : joueurs et guildes simulés. Le vrai multijoueur fonctionne dans la page publiée (et demandera un serveur pour l\'app).</p>';
  }
  function rankingHtml(){
    week();
    const t = tabs('rank', [['players', 'Joueurs'], ['guilds', 'Guildes']], ui.rankTab);
    let list;
    if (ui.rankTab === 'players'){
      const ps = [...C.net.players].sort((a, b) => (b.weekXp || 0) - (a.weekXp || 0));
      list = ps.slice(0, 50).map((p, i) => `<div class="rk ${p.me ? 'me' : ''}"><em class="pos p${i + 1}">${i + 1}</em><div><b>${esc(p.pseudo || 'Lutin')}</b><small>Niveau ${p.pl || 1}${p.guild && C.net.guilds.find(g => g.id === p.guild) ? ' · ' + esc(C.net.guilds.find(g => g.id === p.guild).name) : ''}</small></div><span>${fmt(p.weekXp || 0)} XP</span></div>`).join('');
      const myPos = ps.findIndex(p => p.me);
      if (myPos >= 50) list += `<div class="rk me"><em class="pos">${myPos + 1}</em><div><b>${esc(S().pseudo)}</b></div><span>${fmt(week().xp)} XP</span></div>`;
    } else {
      list = C.net.guilds.slice(0, 50).map((g, i) => `<div class="rk ${g.id === S().guild ? 'me' : ''}"><em class="pos p${i + 1}">${i + 1}</em>${emblem(g)}<div><b>${esc(g.name)}</b><small>${g.members?.length || 0} membres</small></div><span>${fmt(g.weekXp || 0)} XP</span></div>`).join('');
    }
    const end = new Date(); end.setDate(end.getDate() + (7 - (end.getDay() + 6) % 7)); end.setHours(0, 0, 0, 0);
    return `${header(`Semaine en cours · fin dans <b data-until="${end.getTime()}"></b>`, 'Classement')}${t}${netNote()}<div class="ranking">${list || '<span class="meta">Personne pour l\'instant.</span>'}</div>`;
  }
  const emblem = g => `<span class="emb" style="--gc:${g.color || '#3fa2ff'}"><img src="${ICON['em_' + (g.emblem || 'star')] || ICON.shop}" alt=""></span>`;

  /* =================================================================
     GUILDES & GRANDE TOURNÉE
     ================================================================= */
  function myGuild(){ const id = S().guild; return id ? C.net.guilds.find(g => g.id === id) || null : null; }
  function guildHtml(){
    week();
    if (R.pl() < G.GUILD_PL) return `${header('Guildes', 'Guildes')}<p>Les guildes se débloquent au niveau joueur ${G.GUILD_PL}.</p>`;
    const g = myGuild();
    if (!g){
      const list = C.net.guilds.map(x => `<div class="rk">${emblem(x)}<div><b>${esc(x.name)}</b><small>${x.members?.length || 0} membres · ${fmt(x.tour || 0)} pts de tournée</small></div><button class="btn green sm" data-a="gJoin" data-g="${x.id}">Rejoindre</button></div>`).join('');
      return `${header('Guildes', 'Rejoins une guilde')}${netNote()}<p>En guilde, vos livraisons de cadeaux remplissent ensemble le traîneau de la <b>Grande Tournée</b> de la semaine, et tout le monde partage les récompenses.</p>
        <button class="btn gold wide" data-a="gCreate">Créer ma guilde</button><div class="ranking">${list || '<span class="meta">Aucune guilde pour l\'instant : crée la première !</span>'}</div>`;
    }
    const wk = G.weekKey(), claims = S().guildClaims[wk] || [];
    const max = G.TOUR_TIERS.at(-1), tot = g.tour || 0;
    const tiers = G.TOUR_TIERS.map((t, i) => { const rw = G.tourReward(i, R.pl()), ok = tot >= t, got = claims.includes(i);
      return `<div class="tt-row ${ok ? 'ok' : ''}"><b>${fmt(t)}</b><span class="costs">${rwChips(rw)}</span>${got ? '<span class="tick"></span>' : `<button class="btn gold sm" data-a="tourClaim" data-i="${i}" ${ok ? '' : 'disabled'}>Prendre</button>`}</div>`; }).join('');
    const members = [...(g.members || [])].sort((a, b) => (b.tour || 0) - (a.tour || 0)).map((p, i) => `<div class="rk ${p.me ? 'me' : ''}"><em class="pos">${i + 1}</em><div><b>${esc(p.pseudo || 'Lutin')}</b><small>Niveau ${p.pl || 1}${p.id === g.leader ? ' · Chef' : ''}</small></div><span>${fmt(p.tour || 0)} pts</span></div>`).join('');
    const isLeader = g.leader === C.net.myId;
    return `${header('Ta guilde', `${emblem(g)} ${esc(g.name)}`)}${netNote()}${g.desc ? `<p>${esc(g.desc)}</p>` : ''}
      <h3>Grande Tournée de la semaine</h3>
      <div class="tour"><img src="${ICON.sleigh}" alt=""><div><b>${fmt(tot)} / ${fmt(max)} points</b><span class="mbar big"><i style="width:${Math.min(100, tot / max * 100)}%"></i></span><small>Ta contribution : ${fmt(week().tour)} pts</small></div></div>
      <div class="tour-tiers">${tiers}</div>
      <button class="btn green wide" data-a="hotte">Livrer des cadeaux</button>
      <h3>Membres (${g.members?.length || 0})</h3><div class="ranking">${members}</div>
      <div class="acts"><button class="mini" data-a="gLeave">Quitter la guilde</button>${isLeader ? '<button class="mini danger" data-a="gDelete">Dissoudre</button>' : ''}</div>`;
  }
  function createGuild(){
    let color = GUILD_COLORS[0], emb = EMBLEMS[0];
    C.modal(`<small>Nouvelle guilde</small><h2>Créer ma guilde</h2>
      <input id="gName" maxlength="24" placeholder="Nom de la guilde" aria-label="Nom de la guilde">
      <input id="gDesc" maxlength="80" placeholder="Devise (facultatif)" aria-label="Devise">
      <div class="swatches">${GUILD_COLORS.map((c, i) => `<button class="sw ${i ? '' : 'on'}" data-m="color" data-v="${c}" style="background:${c}" aria-label="Couleur"></button>`).join('')}</div>
      <div class="swatches">${EMBLEMS.map((e, i) => `<button class="sw em ${i ? '' : 'on'}" data-m="emb" data-v="${e}" aria-label="Emblème"><img src="${ICON['em_' + e]}" alt=""></button>`).join('')}</div>
      <div class="acts"><button class="btn grey" data-m="close">Annuler</button><button class="btn green" data-m="ok">Créer · ${ic('coins')}500</button></div>`, (a, el) => {
      if (a === 'color' || a === 'emb'){ el.parentNode.querySelectorAll('.sw').forEach(x => x.classList.remove('on')); el.classList.add('on'); if (a === 'color') color = el.dataset.v; else emb = el.dataset.v; return 'keep'; }
      if (a !== 'ok') return;
      const name = document.querySelector('#gName').value.trim().slice(0, 24);
      if (name.length < 3){ C.toast('Le nom doit faire au moins 3 lettres'); return 'keep'; }
      if (S().res.coins < 500){ C.sfx.err(); C.toast('Il faut 500 pièces'); return 'keep'; }
      S().res.coins -= 500;
      C.net.createGuild({name, color, emblem: emb, desc: document.querySelector('#gDesc').value.trim()}).then(() => { C.sfx.bells(); C.save(); C.rerender(); }).catch(() => { S().res.coins += 500; C.toast("La guilde n'a pas pu être créée"); });
    });
  }
  function claimTour(i, el){
    const g = myGuild(); if (!g || (g.tour || 0) < G.TOUR_TIERS[i]) return;
    const wk = G.weekKey(), c = S().guildClaims[wk] = S().guildClaims[wk] || [];
    if (c.includes(i)) return; c.push(i); C.gain(G.tourReward(i, R.pl()), el); C.sfx.bells(); C.save();
  }

  /* =================================================================
     ACTIONS
     ================================================================= */
  const actions = {
    tab: b => { const v = b.dataset.v; if (b.dataset.tab === 'rank') ui.rankTab = v; if (b.dataset.tab === 'hotte') ui.hotteTab = v; if (b.dataset.tab === 'ward') ui.wardTab = v; C.sfx.tap(); },
    loginClaim: b => claimLogin(b), saveStreak: () => saveStreak(),
    eventGo: () => eventGo(), hunt: b => hunt(+b.dataset.i, b),
    refill: () => { if (S().stars < 15){ C.sfx.err(); C.toast("Pas assez d'étoiles"); return; } if (ev().energy >= R.energyMax()) return; S().stars -= 15; ev().energy = R.energyMax(); C.sfx.collect(); },
    tierFree: b => { const i = +b.dataset.i, e = ev(); if (e.pts >= G.EVENT_TIERS[i] && !e.claimed.includes(i)){ e.claimed.push(i); C.gain(G.eventRewards(i, R.pl()).free, b); C.sfx.collect(); } },
    tierPrem: b => { const i = +b.dataset.i, e = ev(); if (R.passOn() && e.pts >= G.EVENT_TIERS[i] && !e.claimedP.includes(i)){ e.claimedP.push(i); C.gain(G.eventRewards(i, R.pl()).prem, b); C.sfx.collect(); } },
    wrapToy: b => { ui.wrapToy = b.dataset.t; C.sfx.tap(); }, wrapPaper: b => { ui.wrapPaper = b.dataset.t; C.sfx.tap(); },
    wrap: () => wrap(C.sel()),
    deliver: b => deliver(b.dataset.k, b), deliverAll: b => deliver(b.dataset.k, b, true),
    albumClaim: b => claimAlbum(b.dataset.t, b),
    buy: b => buy(b.dataset.p), buyStar: b => buyStar(b.dataset.k, +b.dataset.n, +b.dataset.c, b),
    shop: () => C.openPanel('shop'), wardrobe: () => C.openPanel('wardrobe'), hotte: () => C.openPanel('hotte'),
    equip: b => equip(b.dataset.k), buySkin: b => buySkin(b.dataset.k),
    pseudo: () => editPseudo(),
    gJoin: b => C.net.joinGuild(b.dataset.g).then(() => { C.sfx.bells(); C.save(); C.rerender(); }),
    gLeave: () => C.modal(`<h2>Quitter la guilde ?</h2><p>Tes points de la semaine restent acquis pour la guilde.</p><div class="acts"><button class="btn grey" data-m="close">Rester</button><button class="btn green" data-m="ok">Quitter</button></div>`, a => { if (a === 'ok') C.net.leaveGuild().then(() => { C.save(); C.rerender(); }); }),
    gDelete: () => C.modal(`<h2>Dissoudre la guilde ?</h2><p>Elle disparaîtra de la liste pour tout le monde.</p><div class="acts"><button class="btn grey" data-m="close">Annuler</button><button class="btn green" data-m="ok">Dissoudre</button></div>`, a => { if (a === 'ok') C.net.deleteGuild().then(() => { C.save(); C.rerender(); }); }),
    gCreate: () => createGuild(),
    tourClaim: b => claimTour(+b.dataset.i, b),
  };
  const panels = {login: loginHtml, event: eventHtml, hotte: hotteHtml, shop: shopHtml, wardrobe: wardrobeHtml, profile: profileHtml, ranking: rankingHtml, guild: guildHtml};

  return {panels, actions, wrapHtml, reveal, onTrack, tickEnergy, ev, week, loginReady, eventGameDone, myGuild, albumStats, spendEnergy};
}
