# Today — a to-do app

A single-page to-do list backed by Supabase (Postgres + Auth). No build step.

## Run it

```sh
python3 -m http.server 3000
```

Open http://localhost:3000. Port 3000 matters: it's the project's default Site URL, so
sign-up confirmation emails link back here.

## Files

- `index.html` — the whole app (UI, styles, logic)
- `config.js` — project URL and **publishable** key (safe to be public; Row Level Security protects data)
- `supabase/migrations/` — database schema
- `.db-password` — database password (git-ignored, never commit)
