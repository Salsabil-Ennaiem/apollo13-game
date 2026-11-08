# Apollo 13: Fix the Air

**Educational browser game** for classrooms: students experience the Apollo 13 CO₂ emergency and rebuild the improvised “mailbox” adapter that let a **square** Command Module canister work with the Lunar Module’s **round** port.

This repository holds the **complete static web app** — open it in a browser, share a link, or project it in class. No install, no accounts required to play offline.

**Languages:** English / Français

---

## What this repository is for

| Role | Description |
|------|-------------|
| **Classroom activity** | Timed mission: rising CO₂, limited hints, inventory of real-inspired parts |
| **History / STEM** | Based on the real Apollo 13 fix; sizes reference Smithsonian NASM A19760747000 |
| **Projector / shared play** | Optional nickname + public leaderboard page for the whole class |
| **Static website** | Pure HTML / CSS / JS — host anywhere that serves files over HTTPS |

It is **not** a native app, not a Node backend, and not a package you install with npm to “run the game.” The game *is* the web pages in this folder.

---

## How people use it

1. **Teacher / host** puts the site online (or on the school network).
2. **Students** open the URL on laptops, Chromebooks, or phones.
3. They pick a language, enter a nickname (optional for ranking), and play.
4. Optional: open `leaderboard.html` on a projector.

---

## Files that make up the game

```
index.html          Main game page
leaderboard.html    Class / public scoreboard page
config.js           Optional online leaderboard settings only
css/styles.css      Look and layout
js/i18n.js          English + French text
js/game.js          Gameplay, 3D cabin, sound, scoring
```

For normal classroom use you only need these. Leave `config.js` placeholders unchanged to stay fully offline.

---

## Putting it online (recommended)

Upload **only the game files** above to any static host:

- **GitHub Pages** — repo Settings → Pages → deploy from branch  
- **Cloudflare Pages** or **Netlify** — drag-and-drop the folder  

Students then use a normal `https://…` link (or a QR code). That is the intended way to “run” this project.

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

| Action | How |
|--------|-----|
| Rotate | Drag on the cabin |
| Zoom | Scroll / pinch, or `+` / `-` |
| Place a part | Drag from the inventory into the cabin, or select then click the cabin |
| Hint / pause / language | Buttons on screen (`P` to pause; **EN** / **FR** always available) |

The cabin starts like the real problem: square canister present, round port empty. Build the adapter around it.

---

## Optional online scores

By default nothing is stored online.  
If you want a shared leaderboard, put your free Supabase project URL and **anon** key in `config.js`. Without that, the game still works fully offline.

---

## Realism

Canister and hose dimensions follow the Smithsonian object **NASM A19760747000**. Other sizes are approximations marked in the in-game facts panel.
