# Apollo 13: Fix the Air

**Educational browser game** for classrooms: students experience the Apollo 13 CO₂ emergency and rebuild the improvised "mailbox" adapter that let a **square** Command Module canister work with the Lunar Module's **round** port.

This repository holds the **complete static web app** — open it in a browser, share a link, or project it in class. No install, no accounts required to play offline.

**Languages:** English / Français

---

## Architecture

The project is a three-tier architecture that needs **no server of its own**:

```
┌──────────────────────────┐         ┌───────────────────────────────────┐
│  Static front end        │  HTTPS  │  Supabase (free tier)             │
│  (GitHub Pages / any     │────────▶│                                   |
│   static host)           │         │  ┌─────────────────────────────┐  │
│                          │  write  │  │ Edge Function submit-score  │  │
│  index.html + js/game.js │────────▶│  │ (Deno)                      │  │
│                          │         │  │  • input validation         │  │
│  leaderboard.html        │  read   │  │  • anti-cheat (step log,    │  │
│  + config.js             │────────▶│  │    timing, version check)   │  │
│                          │         │  │  • rate limiting            │  │
└──────────────────────────┘         │  │  • SERVICE_ROLE key (bypass │  │
                                     │  │    RLS, writes scores)      │  │
                                     │  └──────────┬──────────────────┘  │
                                     │             ▼                     │
                                     │  ┌─────────────────────────────┐  │
                                     │  │ Postgres                    │  │
                                     │  │  players · runs · rate_limits│ │
                                     │  │  leaderboard  ← public view │  │
                                     │  │  RLS on all tables          │  │
                                     │  └─────────────────────────────┘  │
                                     └───────────────────────────────────┘
```

### Why this shape

| Decision | Reason |
|----------|--------|
| **Static front end** (no Node backend) | The game is pure HTML/CSS/JS. Any static host serves it free and fast; nothing to patch or restart. |
| **All writes go through one Edge Function** | Scores are **recomputed and validated server-side** (step log, timing, hints, game version). A cheater with DevTools cannot POST a fake score. |
| **Service role key only inside the function** | The browser never holds a write-capable key. |
| **Anonymous reads through the `leaderboard` view** | The public sees only `nickname, score, time_left, hints, mistakes, created_at, class_code`. Sensitive columns (`client_ip`, `steps_log`) stay in `runs`, unreachable from the browser. |
| **Supabase Anonymous Sign-in** | Gives each player a stable `auth_uid` for rate limiting without accounts or emails. |

### Data flow

1. Player finishes the mission → `game.js` calls `sb.functions.invoke("submit-score")`.
2. The function validates every field, recomputes the score, rate-limits by IP and nickname, inserts into `runs`, and returns the player's today / week / all-time rank.
3. `leaderboard.html` reads the public `leaderboard` view directly with the publishable (anon) key and auto-refreshes every 10 s.

> **Important:** the view must be created with `security_invoker = off` (the default), and `config.js` `GAME_VERSION` must match `GAME_VERSION` inside `supabase/functions/submit-score/index.ts`, or submissions are rejected.

---

## What this repository is for

| Role | Description |
|------|-------------|
| **Classroom activity** | Timed mission: rising CO₂, limited hints, inventory of real-inspired parts |
| **History / STEM** | Based on the real Apollo 13 fix; sizes reference Smithsonian NASM A19760747000 |
| **Projector / shared play** | Optional nickname + public leaderboard page for the whole class |
| **Static website** | Pure HTML / CSS / JS — host anywhere that serves files over HTTPS |

It is **not** a native app, not a Node backend, and not a package you install with npm to "run the game." The game *is* the web pages in this folder.

---

## How people use it

1. **Teacher / host** puts the site online (or on the school network).
2. **Students** open the URL on laptops, Chromebooks, or phones.
3. They pick a language, enter a nickname (optional for ranking), and play.
4. Optional: open `leaderboard.html` on a projector.

---

## Files that make up the game

```
index.html                        Main game page
leaderboard.html                  Class / public scoreboard page
config.js                         Supabase URL + publishable key + GAME_VERSION
css/styles.css                    Look and layout
js/i18n.js                        English + French text
js/game.js                        Gameplay, 3D cabin, sound, scoring, tutorial
img/mat-*.png                     Photos of the real objects (Reference folder)
img/cabin-install.jpg, nasm-*.jpg Historical photos of the final adapter (Research)
audio/*.mp3                       Radio + breathing loops (MP3: plays on iPhone / Safari)
supabase/functions/submit-score/  Score submission Edge Function (Deno)
```

The publishable key in `config.js` is safe to expose: it can only read the public leaderboard view. There are **no secrets** in this repository.

* * *

## Putting it online

### 1. Front end

Upload the game files to any static host:

- **GitHub Pages** — repo Settings → Pages → deploy from branch
- **Cloudflare Pages** or **Netlify** — drag-and-drop the folder

Students then use a normal `https://…` link (or a QR code).

### 2. Backend (only if you want the online leaderboard)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL editor, create the tables `players`, `runs`, `rate_limits` and the public `leaderboard` view, with **RLS enabled and no public policies** (only the Edge Function writes, using the service role).
3. Put the project URL and the **publishable** key in `config.js`.
4. Deploy the function:

```bash
supabase functions deploy submit-score --no-verify-jwt
```

Without `config.js` values, the game still works fully offline — nothing is stored online.

---

## Trying it on your own computer (optional)

Browsers block some features when you double-click `index.html` (`file://`). To test on your machine, serve the folder with any static file server, for example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080`.
Any equivalent tool is fine (`npx serve`, VS Code Live Server, etc.). Python is only one convenient option — it is **not** part of the game.

---

## In-game controls

| Action                  | How                                                                                       |
|-------------------------|-------------------------------------------------------------------------------------------|
| Rotate / zoom           | Drag on the cabin; scroll or pinch, or `+` / `-`                                          |
| Place a part            | Open the **Parts box**, select a part, then **Place** (inside the box) or tap the outline |
| Reference folder        | Photos of the real objects (free)                                                         |
| 💡 Hint                 | Costs 15 s and one of 3 hints; the label shows on hover                                   |
| 🔍 Research             | Photos of the real finished adapter; costs 20 s the first time each round                 |
| ⋯ menu                  | Pause (`P`), reset view, fullscreen, mute all / radio / breath, volume, EN / FR, tutorial |

The ⋯ menu closes when you tap outside it, tap ⋯ again, press Esc, or scroll / drag the cabin.

The cabin starts like the real problem: square canister present, round port empty. Build the adapter around it.

### Tutorial

On the first round, a skippable coach-mark tutorial points to the brief, the Parts box, a part, the folder and Place. The timer is frozen while it is open. Replay it from ❓ in the ⋯ menu. It never reveals the solution.

### Start-screen options

| Option          | What it does                                                                                           |
|-----------------|--------------------------------------------------------------------------------------------------------|
| Time            | 3 min (default), 5 min or 8 min                                                                        |
| Teams (Settings)| Optional local hot-seat mode: comma-separated team names (max 4). Teams play one after another and the end screen compares them. Team games are **not** sent to the online leaderboard. Leave empty for a ranked solo run. |
| Reduced effects | Off by default. Turns off blur, flicker and sway for sensitive players.                                |

### Class codes

A class code (4–8 letters/digits, optional) groups scores into a private board. Enter it on the nickname screen under **More**. On `leaderboard.html`, type the code to filter, or share a link like `leaderboard.html?class=ABCD`. The Supabase `leaderboard` view must expose the `class_code` column.

### Audio

Audio is MP3 only (Safari and iOS cannot play Ogg). Keep the file names `breath-loop.mp3`, `breath-critical.mp3` and `Apollo13-wehaveaproblem.mp3`.

* * *

## Privacy

- No emails, no real names, no accounts. A nickname is all a player provides.
- `client_ip` is stored in `runs` for rate limiting and is **not** readable through the public view.
- Scores can be deleted on request.
- The browser talks only to Supabase over HTTPS; the page's Content-Security-Policy allows no other external connections.

---

## Realism

Canister and hose dimensions follow the Smithsonian object **NASM A19760747000**. Other sizes are approximations marked in the in-game facts panel.
