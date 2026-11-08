# Apollo 13: Fix the Air – Classroom Game + Public Leaderboard

A single-file (plus one leaderboard page) educational game about the Apollo 13 CO₂ emergency.

## Files

| File | Purpose |
|------|---------|
| `index.html` | The full game (3D, sound, stress effects, nickname, scoring) |
| `leaderboard.html` | Public / classroom projector leaderboard |
| `schema.sql` | Supabase tables, view, RLS, indexes |
| `supabase/functions/submit-score/index.ts` | Edge Function that validates the event log and writes scores |
| `SETUP.md` | Step-by-step beginner guide |
| `TEST_PLAN.md` | Checklist for testing before class |

## Realism notes

- Canister dimensions taken from the Smithsonian National Air and Space Museum object **NASM A19760747000**:
  - Main body: **18.4 × 18.4 × 22.9 cm**
  - Hose: **132.1 × 3.8 cm**
- Other items use clearly marked approximations.
- 1 Three.js unit = 1 cm.

## Quick start (local, no leaderboard)

Just open `index.html` in a modern browser. Internet is required only once to load Three.js and (optionally) Supabase.

## Quick start (with public scores)

1. Follow **SETUP.md** (create Supabase project → run schema → deploy function → paste keys → host on GitHub Pages).
2. Share the game URL and the leaderboard URL (or a QR code).

## Hosting (free)

- GitHub Pages or Cloudflare Pages / Netlify Drop for the static files.
- Supabase free tier for the database + Edge Function.

## Security summary

- Client sends only an **event log** (step + relative timestamp), never a trusted score.
- Edge Function recomputes the score, checks order, timing, rate limits, and only then inserts.
- Row Level Security: anonymous users can only **SELECT** the leaderboard view.
- No emails, no real names, no tracking cookies beyond Supabase anonymous auth.
- CSP restricts `connect-src` to your Supabase project.

## Customisation

See the comment block at the top of `index.html` and the original code guide. All difficulty numbers live in the `CFG` object; dimensions live in `DIM`.

## Licence / credit

Game concept and educational use of the Apollo 13 “mailbox” story. Dimensions from Smithsonian / NASA public sources. Use freely in classrooms.
