// Réseau : classement, guildes et Grande Tournée d'équipe.
//
// Deux implémentations derrière la même interface :
//  - EN LIGNE : la base de données partagée de la page publiée sur claude.ai (capacités `db` + `user`).
//    Chaque joueur écrit seulement son propre document `players/<id>` ; une guilde est le document
//    `guilds/<id du créateur>`. Pour une app publiée sur les stores, remplacer cette partie par un
//    vrai serveur (Firebase, Supabase…) en gardant la même interface.
//  - HORS LIGNE (démo) : des joueurs et guildes simulés, calculés localement.
import {weekKey} from './game.js';

const NAMES = ['Flocon', 'Biscotte', 'Gui', 'Cannelle', 'Grelot', 'Myrtille', 'Pépin', 'Noisette', 'Givre', 'Praline', 'Sapinou', 'Clochette', 'Pain-Épice', 'Bûchette', 'Étincelle', 'Marron', 'Houx', 'Caramel', 'Paillette', 'Rudolph', 'Nougat', 'Cacao', 'Tourbillon', 'Mistral'];
const GUILDS = [['Les Rennes Rapides', '#ef3b4f', 'deer'], ['Atelier Polaire', '#3fa2ff', 'gear'], ['Les Biscuits Fous', '#d08a4e', 'cookie'], ['Étoile du Nord', '#ffc83a', 'star'], ['Clan du Gui', '#3fbf6a', 'leaf'], ['Les Flocons', '#8fd8ff', 'tree']];
export const EMBLEMS = ['star', 'deer', 'tree', 'gift', 'bell', 'cookie', 'gear', 'leaf'];
export const GUILD_COLORS = ['#ef3b4f', '#3fa2ff', '#3fbf6a', '#ffc83a', '#b04dff', '#ff8a2a', '#1d2547', '#ff7bb5'];

function rng(seed){ let s = 0; for (const c of seed) s = (s * 31 + c.charCodeAt(0)) | 0; return () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

export function createNet(getState){
  const listeners = new Set();
  const net = {
    mode: 'connecting', myId: 'me', players: [], guilds: [], error: '',
    onChange(fn){ listeners.add(fn); return () => listeners.delete(fn); },
  };
  const emit = () => listeners.forEach(f => { try { f(); } catch(e){ console.error(e); } });
  const S = getState;
  const myDoc = () => {
    const s = S(), wk = weekKey();
    return {pseudo: s.pseudo, pl: s.pl, skin: s.skins.santa, week: wk, weekXp: s.week.key === wk ? s.week.xp : 0, guild: s.guild || '', tourWeek: wk, tour: s.week.key === wk ? s.week.tour : 0};
  };

  /* ------------------------- hors ligne ------------------------- */
  function offline(){
    net.mode = 'offline'; net.myId = 'me';
    const recompute = () => {
      const s = S(), wk = weekKey(), R = rng(wk);
      const now = new Date(), progress = Math.min(1, (((now.getDay() + 6) % 7) * 24 + now.getHours() + 1) / (7 * 24));
      const bots = NAMES.map((n, i) => {
        const pl = Math.max(1, Math.round(s.pl + (R() - .45) * 10));
        return {id: 'bot' + i, pseudo: n + (i % 3 ? '' : ' ★'), pl, skin: 'classic', weekXp: Math.round(Math.pow(pl, 1.7) * 30 * (.3 + R()) * progress), guild: 'g' + (i % GUILDS.length), tour: Math.round((200 + R() * 1800) * progress * (1 + pl / 10)), bot: true};
      });
      const me = {id: 'me', ...myDoc(), me: true};
      net.players = [...bots, me];
      const custom = s.localGuild ? [{id: 'mine', name: s.localGuild.name, color: s.localGuild.color, emblem: s.localGuild.emblem, desc: s.localGuild.desc, leader: 'me'}] : [];
      net.guilds = [...GUILDS.map(([name, color, emblem], i) => ({id: 'g' + i, name, color, emblem, desc: 'Guilde de démonstration', leader: 'bot' + i})), ...custom];
      decorate(); emit();
    };
    let pend = null;
    net.push = () => { if (!pend) pend = setTimeout(() => { pend = null; recompute(); }, 1500); };
    net.createGuild = async g => { S().localGuild = g; S().guild = 'mine'; recompute(); return 'mine'; };
    net.joinGuild = async id => { S().guild = id; recompute(); };
    net.leaveGuild = async () => { S().guild = null; recompute(); };
    net.deleteGuild = async () => { S().localGuild = null; S().guild = null; recompute(); };
    recompute(); setInterval(recompute, 60000);
  }

  /* ------------------------- en ligne ------------------------- */
  async function online(db, uid){
    net.mode = 'online'; net.myId = uid;
    let lastJson = '', pending = null, writing = false;
    const write = async () => {
      pending = null;
      const d = myDoc(), j = JSON.stringify(d);
      if (j === lastJson || writing) return;
      writing = true;
      try { await db.doc('players/' + uid).set({...d, t: Date.now()}); lastJson = j; net.canWrite = true; }
      catch(e){ if (e?.code === 'invalid_argument') { net.canWrite = false; net.error = "Tu peux voir le classement, mais il faut l'accès Contributeur à la page pour y apparaître."; emit(); } }
      writing = false;
    };
    net.push = (now = false) => { if (now) return write(); if (!pending) pending = setTimeout(write, 12000); };
    net.createGuild = async g => {
      await db.doc('guilds/' + uid).set({name: g.name.slice(0, 24), color: g.color, emblem: g.emblem, desc: (g.desc || '').slice(0, 80), leader: uid, created: Date.now()});
      S().guild = uid; await write(); return uid;
    };
    net.joinGuild = async id => { S().guild = id; await write(); };
    net.leaveGuild = async () => { S().guild = null; await write(); };
    net.deleteGuild = async () => { await db.doc('guilds/' + uid).delete(); S().guild = null; await write(); };
    let gotPlayers = false, gotGuilds = false;
    const timer = setTimeout(() => { if (!gotPlayers) { net.error = 'Connexion au classement impossible pour le moment.'; emit(); } }, 10000);
    db.collection('players').limit(1000).onSnapshot(snap => {
      gotPlayers = true; clearTimeout(timer); net.error = net.canWrite === false ? net.error : '';
      net.players = snap.docs.map(d => ({id: d.id, ...d.data(), me: d.id === uid}));
      decorate(); emit();
    }, e => { net.error = 'Le classement est indisponible.'; emit(); });
    db.collection('guilds').limit(300).onSnapshot(snap => {
      gotGuilds = true;
      net.guilds = snap.docs.map(d => ({id: d.id, ...d.data()}));
      decorate(); emit();
    }, () => {});
    write();
  }

  /* ------------------------- agrégats ------------------------- */
  function decorate(){
    const wk = weekKey();
    for (const p of net.players){ if (p.week !== wk && !p.bot) { p.weekXp = 0; } if (p.tourWeek !== wk && !p.bot) p.tour = 0; }
    const byGuild = {};
    for (const p of net.players) if (p.guild) (byGuild[p.guild] = byGuild[p.guild] || []).push(p);
    for (const g of net.guilds){ const m = byGuild[g.id] || []; g.members = m; g.weekXp = m.reduce((a, p) => a + (p.weekXp || 0), 0); g.tour = m.reduce((a, p) => a + (p.tour || 0), 0); }
    net.guilds.sort((a, b) => b.weekXp - a.weekXp);
  }

  // démarrage : en ligne si la page tourne dans claude.ai avec la base partagée, sinon démo
  (async () => {
    try {
      if (window.claude?.use){
        const [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]);
        const uid = user ? await user.id() : null;
        if (db && uid) return online(db, uid);
      }
    } catch(e){}
    offline();
  })();
  return net;
}
