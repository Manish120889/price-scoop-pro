# Fatey — Fitness, Recipes & Programs

A modern fitness companion: athlete-grade recipes rooted in Punjabi cooking, structured training programs, a daily tracker, and a personal "Today" dashboard.

Built on Lovable (React + Vite + Tailwind + shadcn/ui) with Lovable Cloud (Supabase) for auth, database, and serverless functions.

## Features

- **Recipes** — browse, filter, and view recipes with full macros, ingredients, and step-by-step instructions
- **Programs** — multi-week training programs with daily workouts, videos, and rest days
- **Tracker** — log weight, workouts, and notes per day
- **Today** — personalized dashboard showing streak, weekly stats, saved recipes, and program progress
- **Favorites** — save recipes for quick access
- **Auth** — email/password + Google sign-in (verified email required)
- **Admin** — content authoring UI for recipes, programs, and program days, plus a role management console

## Tech stack

- React 18, Vite 5, TypeScript 5
- Tailwind CSS v3 + shadcn/ui
- React Router v6
- Lovable Cloud (Supabase) — Postgres, Row-Level Security, Edge Functions, Auth
- React Query, Lucide icons, Sonner toasts

## Database

Public-schema tables:

| Table | Purpose |
|---|---|
| `profiles` | Per-user display name, avatar, bio |
| `user_roles` | `admin` / `moderator` / `user` role assignments |
| `recipes` | Recipes with macros, ingredients (jsonb), instructions (jsonb), tags |
| `programs` | Training programs (slug, level, category, duration) |
| `program_days` | Individual days inside a program (exercises jsonb, video, rest flag) |
| `progress_logs` | Per-user, per-day weight / workout / notes |
| `favorites` | Polymorphic favorites (item_type + item_id) |

RLS is enabled on every table. Roles are checked via the `has_role(uuid, app_role)` SECURITY DEFINER function — never via client-side flags.

## Local dev

This project lives on Lovable. To run locally:

```bash
npm install
npm run dev
```

The Supabase client and types are auto-generated — do not edit `src/integrations/supabase/client.ts` or `src/integrations/supabase/types.ts`.

## Becoming the first admin

1. Sign up via `/auth`
2. Visit `/admin` — if no admin exists yet, click **"Make me first admin"**
3. Once promoted, open the **Users & Roles** tab to grant `admin` or `moderator` to other users

## Deployment

Published via Lovable. Open the project in Lovable and click **Publish**. A custom domain can be added under Project → Settings → Domains.

## License

Private project.
