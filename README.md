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
| `NEXT_PUBLIC_SITE_URL` | public | Base URL used for metadata and absolute links |
| `NEXT_PUBLIC_SUPABASE_URL` | public | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | public | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | server only | Service role key; never expose to the browser |

## Project structure

```text
src/
  app/                 # Routes (App Router)
    (shop)/            # Customer-facing pages
    (auth)/            # Login / register / password reset
    admin/             # Admin dashboard
    api/               # Route handlers and webhooks
  components/
    ui/                # Reusable UI primitives
    layout/            # Header, footer, navigation
    shop/              # Storefront components
    admin/             # Admin dashboard components
  lib/
    supabase/          # Browser and server Supabase clients
    utils.ts           # Shared helpers (cn)
  config/
    site.ts            # Site metadata and constants
  types/               # Shared TypeScript types
  actions/             # Server actions
```

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## Roadmap

Phase 01 (current) — project setup complete: Next.js, TypeScript, Tailwind, Supabase clients, GitHub connection.

Next: Phase 02 — database schema, tables and relationships, authentication, RLS.
