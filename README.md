# Bachman Beauty

Full-stack e-commerce store for Bachman Beauty skincare products, including a customer storefront and an admin dashboard.

## Stack

- Next.js 16 (App Router, Turbopack, Cache Components)
- TypeScript
- Tailwind CSS v4
- Supabase (Postgres, Auth, Storage, RLS)
- npm

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

### Environment variables

Copy `.env.example` to `.env.local` and fill in the values:

```bash
cp .env.example .env.local
```

| Variable | Scope | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | public | Base URL used for metadata and auth redirects |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anon/publishable key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Service role key; never expose to the browser |

## Database

Migrations live in `supabase/migrations` and are applied in filename order:

1. `20261105120000_initial_schema.sql` — enums, tables, indexes, triggers
2. `20261105120100_rls_policies.sql` — RLS policies and storage buckets
3. `20261105120200_seed_data.sql` — categories, shipping zones, settings

Apply them with the Supabase CLI (`supabase db push`) or paste each file into the
Supabase Dashboard SQL Editor.

### Make a user an admin

After the user signs up, run:

```sql
insert into public.user_roles (user_id, role)
values ('<auth-user-uuid>', 'admin')
on conflict (user_id) do update set role = 'admin';
```

The UUID is under **Authentication → Users** in the Supabase Dashboard.

### Auth redirect URLs

In **Authentication → URL Configuration**, set:

- Site URL: `http://localhost:3000` (later the production domain)
- Redirect URLs: `http://localhost:3000/auth/callback`

## Project structure

```text
src/
  app/                 # Routes (App Router)
    (auth)/            # Login, register, password reset
    (shop)/            # Customer-facing pages
    admin/             # Admin dashboard (admin-only)
    auth/callback/     # Supabase auth code exchange
    account/           # Customer account (signed-in)
    api/               # Route handlers and webhooks
  components/
    ui/                # Reusable UI primitives
    layout/            # Header, footer, navigation
    shop/              # Storefront components
    admin/             # Admin dashboard components
    auth/              # Auth forms
  lib/
    supabase/          # Browser, server and proxy clients
    auth.ts            # Session and role helpers
    redirects.ts       # Safe post-login redirects
    utils.ts           # Shared helpers (cn)
  config/
    site.ts            # Site metadata and constants
  types/               # Shared TypeScript types
  actions/             # Server actions
supabase/
  migrations/          # Versioned SQL migrations
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Roadmap

- Phase 01 — project setup: done.
- Phase 02 — database schema, authentication, RLS: done.
- Phase 03 — site layout, header, footer, homepage, responsive design: done.
- Phase 04 — customer website (shop, cart, checkout): next.
