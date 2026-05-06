# Prompt pour Claude Code (à exécuter sur le PC Windows)

> Colle tout ce qui suit comme premier message dans une nouvelle session Claude Code lancée dans le dossier où tu veux que le projet vive (par ex. `C:\Users\<toi>\claude-pilot`).

---

## Mission

Tu es sur un PC **Windows**. Construis une **application web mobile-first appelée "Claude Pilot"** qui me permet, depuis mon iPhone (via Tailscale), de chatter avec **toi-même** (Claude Code) qui tourne sur ce PC. Le but : je tape une instruction au pouce, tu agis sur le PC (fichiers, shell, MCP), tu me streames la réponse en direct dans le chat — comme une version mobile de Claude Desktop.

**Contrainte critique : zéro frais API.** L'app doit utiliser mon abonnement **Claude Max 5x** déjà connecté dans le CLI `claude`. Pour ça, **spawn le binaire `claude` en subprocess** ; n'utilise PAS le SDK Anthropic, n'utilise PAS de clé `ANTHROPIC_API_KEY`. Le CLI prendra automatiquement les credentials OAuth de ma session.

## Architecture

```
📱 iPhone (Safari)
   │  HTTP + Server-Sent Events sur Tailscale
   ▼
💻 Serveur Node.js (port 3000, bind 0.0.0.0)
   │  spawn subprocess
   ▼
   claude -p "<msg>" --output-format stream-json --resume <session-id>
   │
   ▼ utilise ~/.claude/credentials (mon abonnement Max 5x)
```

## Stack imposée (zéro build step, zéro framework lourd)

- **Backend** : Node.js + `express` + `cors` (rien d'autre)
- **Frontend** : HTML + JS + CSS vanilla, **un seul fichier HTML** servi par Express
  - TailwindCSS via CDN
  - `marked` via CDN pour le rendu markdown
  - `highlight.js` via CDN pour le code
- **Persistance** : un fichier JSON par conversation dans `./conversations/<id>.json`
- **Pas de TypeScript, pas de React, pas de Vite, pas de bundler.**

## Endpoints HTTP

| Méthode | Route | Rôle |
|---|---|---|
| GET | `/` | sert l'app web (HTML+JS) |
| GET | `/api/conversations` | liste des conversations (id, titre = 1er message tronqué, date) |
| GET | `/api/conversations/:id` | renvoie l'historique complet d'une conversation |
| POST | `/api/conversations` | crée une nouvelle conversation vide, renvoie son id |
| POST | `/api/conversations/:id/messages` | envoie un message utilisateur ; **retourne un flux SSE** des événements Claude en streaming |
| DELETE | `/api/conversations/:id` | supprime une conversation |

## Logique du POST `/api/conversations/:id/messages`

1. Reçoit `{ message: string, cwd?: string }` dans le body.
2. Charge le JSON de la conversation. Récupère `session_id` s'il existe.
3. Spawn :
   ```
   claude -p "<message>" --output-format stream-json --verbose [--resume <session_id>]
   ```
   Avec `cwd` du subprocess = `cwd` demandé (par défaut : `os.homedir()`).
4. Lit la stdout **ligne par ligne** (chaque ligne = un événement JSON).
5. Pour chaque événement, **réémets-le tel quel** au client via SSE (`event: claude\ndata: {...}\n\n`), pour que le frontend puisse rendre tous les types (assistant text, tool_use, tool_result, result final).
6. Quand l'événement `result` arrive : extrais et sauvegarde `session_id`, ferme le SSE.
7. Persiste : ajoute le message user + tous les événements assistant au fichier JSON de la conversation.

> **Note importante** : avant de coder, lance `claude --help` et `claude -p "test" --output-format stream-json --verbose` pour observer la structure exacte des événements et adapter le parsing. Ne devine pas le schéma JSON.

## UI (un seul fichier HTML servi par `/`)

- **Visuellement proche de Claude Desktop** : fond clair, typo system-ui, bulles user à droite avec fond légèrement orangé (Anthropic-ish), bulles assistant à gauche, plain text.
- **Mobile-first** : testé d'abord pour iOS Safari, marche aussi sur desktop.
- **Sidebar gauche** (rétractable en hamburger sur mobile) : liste des conversations, bouton "Nouvelle conversation" en haut.
- **Pane principal** : messages scrollables, input multilignes en bas avec bouton d'envoi.
- **Tool calls** rendus comme des blocs dépliables : `● Read foo.ts` (cliquer pour voir le contenu/résultat). Mêmes pour `Bash`, `Edit`, `Write`, etc. Distinguer visuellement *tool en cours* vs *tool terminé*.
- **Markdown** rendu avec marked + code blocks colorés via highlight.js.
- **Streaming visible** : le texte apparaît au fur et à mesure que les tokens arrivent.
- **Auto-scroll** vers le bas, sauf si l'utilisateur a scrollé manuellement.
- **Working directory** : champ éditable par conversation (défaut = `os.homedir()`), affiché en haut du pane.
- **Indicateur "Claude réfléchit"** quand un tool tourne ou que la réponse n'a pas commencé.
- **Clavier** : Entrée = envoyer, Shift+Entrée = nouvelle ligne. Sur mobile, idem.

## Sécurité

- **Pas d'authentification** : on s'appuie sur le réseau privé Tailscale.
- Bind sur `0.0.0.0:3000` pour accès LAN + Tailscale.
- **Pas de confinement de chemins** : Claude a accès complet au filesystem (choix utilisateur assumé).

## Fichiers à créer

```
claude-pilot/
├── package.json
├── server.js
├── public/
│   └── index.html       (HTML + <script> + <style> dans un seul fichier)
├── conversations/        (créé au runtime)
├── start.ps1             (lance le serveur)
└── README.md             (comment démarrer + accéder depuis iPhone)
```

## Vérifications avant de me dire "c'est fini"

1. `npm install` passe sans erreur.
2. `node server.js` démarre, affiche "listening on 0.0.0.0:3000".
3. Ouvrir `http://localhost:3000` dans un navigateur du PC.
4. Cliquer "Nouvelle conversation", envoyer : **"Quel est le dossier courant et liste son contenu"**. Vérifier que tu (Claude) réponds correctement, que le tool `Bash` s'affiche bien dans la bulle avec son résultat.
5. Envoyer un follow-up : **"Et combien de fichiers .md ?"**. Vérifier que `--resume` fonctionne et que tu as bien le contexte précédent.
6. Killer le serveur (Ctrl+C), relancer, vérifier que la conversation est toujours dans la sidebar et chargeable.
7. Trouver le nom Tailscale du PC (`tailscale status`) et donner l'URL exacte à utiliser depuis l'iPhone (genre `http://nom-du-pc.tail-xxxx.ts.net:3000`).

## Ce qu'il NE faut PAS faire

- ❌ Pas d'utilisation du SDK `@anthropic-ai/sdk` ni `@anthropic-ai/claude-agent-sdk`.
- ❌ Pas de clé API Anthropic.
- ❌ Pas d'auth (login/password/token) — Tailscale suffit.
- ❌ Pas de framework frontend (React/Vue/Svelte).
- ❌ Pas de TypeScript, pas de bundler.
- ❌ Pas de fonctionnalités non listées (pas de partage, pas d'export, pas de tags, etc. — on raffine après).

## Livrable

Quand c'est fini, donne-moi :
1. Le chemin absolu du projet sur le PC.
2. La commande exacte à lancer pour le démarrer (PowerShell).
3. L'URL Tailscale à ouvrir depuis l'iPhone.
4. Une capture d'écran du chat fonctionnant en local (test n°4 ci-dessus).
