# SchoolCove

Preschool and daycare discovery for parents in Gurugram, with a lead dashboard for schools.

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000. With no `DATABASE_URL`, a local file database is created in `.data/` and filled with the starter schools.
Admin login: the `ADMIN_EMAIL` / `ADMIN_PASSWORD` from your environment (defaults: `admin@schoolcove.in` / `schoolcove-admin`).

## Deploy on Vercel
1. Push this folder to a GitHub repository and import it in Vercel.
2. Add a Postgres database (Vercel Storage > Neon, or Supabase) and set `DATABASE_URL`.
3. Set `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` and, optionally, `LEAD_PRICE` and `GOOGLE_PLACES_API_KEY` (see `.env.example`).
Tables and starter schools are created automatically on first load.

## Where things are
- `lib/seed.ts` starter school data
- `app/schools` parent pages, `app/dashboard` school dashboard, `app/admin` admin panel
- `app/api/export` Excel download of enquiries
